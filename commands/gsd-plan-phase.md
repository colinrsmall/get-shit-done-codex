---
description: Create detailed execution plan for a phase (PLAN.md) with verification loop
argument-hint: "[phase] [--research] [--skip-research] [--gaps] [--skip-verify]"
agent: gsd-planner
tools:
  read: true
  write: true
  bash: true
  glob: true
  grep: true
  task: true
  webfetch: true
  mcp__context7__*: true
---

<execution_context>
</execution_context>

<objective>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) → Plan → Verify → Review → Done (review mandatory in interactive mode)

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped or exists), spawn gsd-planner agent, verify plans with gsd-plan-checker, iterate until plans pass or max iterations reached, present results.

**Why subagents:** Research and planning burn context fast. Verification uses fresh context. User sees the flow between agents in main context.
</objective>

<context>
Phase number: $ARGUMENTS (optional - auto-detects next unplanned phase if not provided)

**Flags:**
- `--research` — Force re-research even if RESEARCH.md exists
- `--skip-research` — Skip research entirely, go straight to planning
- `--gaps` — Gap closure mode (reads VERIFICATION.md, skips research)
- `--skip-verify` — Skip planner → checker verification loop

Normalize phase input in step 2 before any directory lookups.
</context>

<process>

## 1. Validate Environment

Use `list` to check that `.planning/` exists.

**If not found:** Error - user should run `/gsd-new-project` first.

## 2. Parse and Normalize Arguments

Extract from $ARGUMENTS:

- Phase number (integer or decimal like `2.1`)
- `--research` flag to force re-research
- `--skip-research` flag to skip research
- `--gaps` flag for gap closure mode
- `--skip-verify` flag to bypass verification loop

**If no phase number:** Detect next unplanned phase from roadmap.

**Normalize phase to zero-padded format:**

```bash
# Normalize phase number (8 → 08, but preserve decimals like 2.1 → 02.1)
if [[ "$PHASE" =~ ^[0-9]+$ ]]; then
  PHASE=$(printf "%02d" "$PHASE")
elif [[ "$PHASE" =~ ^([0-9]+)\.([0-9]+)$ ]]; then
  PHASE=$(printf "%02d.%s" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}")
fi
```

**Check for existing research and plans:**

Use `glob` to check for:
- `.planning/phases/${PHASE}-*/*-RESEARCH.md`
- `.planning/phases/${PHASE}-*/*-PLAN.md`

## 3. Validate Phase

Use `read` on `.planning/ROADMAP.md` and locate the `Phase ${PHASE}:` section (use `grep` tool if needed).

**If not found:** Error with available phases. **If found:** Extract phase number, name, description.

## 4. Ensure Phase Directory Exists

Use `glob` to find `.planning/phases/${PHASE}-*` and select the first match as `PHASE_DIR`.

If none exists:
- Read `.planning/ROADMAP.md` to get the phase name
- Create the directory `.planning/phases/${PHASE}-{phase-name-slug}` via Bash

## 5. Handle Research

**If `--gaps` flag:** Skip research (gap closure uses VERIFICATION.md instead).

**If `--skip-research` flag:** Skip to step 6.

**Check config for research setting:**

```bash
WORKFLOW_RESEARCH=$(cat .planning/config.json 2>/dev/null | grep -o '"research"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
```

**If `workflow.research` is `false` AND `--research` flag NOT set:** Skip to step 6.

**Otherwise:**

Check for existing research:

```bash
ls "${PHASE_DIR}"/*-RESEARCH.md 2>/dev/null
```

**If RESEARCH.md exists AND `--research` flag NOT set:**
- Display: `Using existing research: ${PHASE_DIR}/${PHASE}-RESEARCH.md`
- Skip to step 6

**If RESEARCH.md missing OR `--research` flag set:**

Proceed to spawn researcher

### Spawn gsd-phase-researcher

Gather context for the research prompt:

- Use `read` to load `.planning/ROADMAP.md` and extract the current phase description
- Use `read` for `.planning/REQUIREMENTS.md` (if present) and extract the Requirements section
- Use `read` for `.planning/STATE.md` and extract the Decisions section
- Use `glob` + `read` for `${PHASE_DIR}/*-CONTEXT.md` if it exists

Fill research prompt and spawn:

```markdown
<objective>
Research how to implement Phase {phase_number}: {phase_name}

Answer: "What do I need to know to PLAN this phase well?"
</objective>

<context>
**Phase description:**
{phase_description}

**Requirements (if any):**
{requirements}

**Prior decisions:**
{decisions}

**Phase context (if any):**
{phase_context}
</context>

<output>
Write research findings to: {phase_dir}/{phase}-RESEARCH.md
</output>
```

```
Task(
  prompt=research_prompt,
  subagent_type="gsd-phase-researcher",
  description="Research Phase {phase}"
)
```

### Handle Researcher Return

**`## RESEARCH COMPLETE`:**
- Display: `Research complete. Proceeding to planning...`
- Continue to step 6

**`## RESEARCH BLOCKED`:**
- Display blocker information
- Offer: 1) Provide more context, 2) Skip research and plan anyway, 3) Abort
- Wait for user response

## 6. Check Existing Plans

Use `glob` to list `${PHASE_DIR}/*-PLAN.md`.

**If exists:** Ask how to proceed in natural language. Suggest options:
- Continue planning (add more plans)
- View existing plans
- Replan from scratch

Wait for user response.

## 7. Read Context Files

Read and store context file contents for the planner agent. The `@` syntax does not work across Task() boundaries - content must be inlined.

Use `read` to load required files:
- `.planning/STATE.md`
- `.planning/ROADMAP.md`

Use `glob` + `read` for optional files (if present):
- `.planning/PROJECT-REVIEW.md`
- `.planning/REQUIREMENTS.md`
- `${PHASE_DIR}/*-CONTEXT.md`
- `${PHASE_DIR}/*-RESEARCH.md`
- `${PHASE_DIR}/${PHASE}-REVIEW.md`

For `--gaps` mode, also load:
- `${PHASE_DIR}/*-VERIFICATION.md`
- `${PHASE_DIR}/*-UAT.md`

## 8. Spawn gsd-planner Agent

Fill prompt with inlined content and spawn:

```markdown
<planning_context>

**Phase:** {phase_number}
**Mode:** {standard | gap_closure}

**Project State:**
{state_content}

**Roadmap:**
{roadmap_content}

**Project Review (if exists):**
{project_review_content}

**Requirements (if exists):**
{requirements_content}

**Phase Context (if exists):**
{context_content}

**Research (if exists):**
{research_content}

**Phase Review (if exists):**
{review_content}

**Gap Closure (if --gaps mode):**
{verification_content}
{uat_content}

</planning_context>

<downstream_consumer>
Output consumed by /gsd-execute-phase
Plans must be executable prompts with:

- Frontmatter (wave, depends_on, files_modified, autonomous)
- Tasks in XML format
- Verification criteria
- must_haves for goal-backward verification
</downstream_consumer>

<quality_gate>
Before returning PLANNING COMPLETE:

- [ ] PLAN.md files created in phase directory
- [ ] Each plan has valid frontmatter
- [ ] Tasks are specific and actionable
- [ ] Dependencies correctly identified
- [ ] Waves assigned for parallel execution
- [ ] must_haves derived from phase goal
- [ ] {phase}-REVIEW.md updated with decisions, assumptions, questions
</quality_gate>
```

```
Task(
  prompt=filled_prompt,
  subagent_type="gsd-planner",
  description="Plan Phase {phase}"
)
```

## 9. Handle Planner Return

Parse planner output:

Read workflow mode:

```bash
WORKFLOW_MODE=$(cat .planning/config.json 2>/dev/null | grep -o '"mode"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
WORKFLOW_MODE=${WORKFLOW_MODE:-interactive}
```

**`## PLANNING COMPLETE`:**
- Display: `Planner created {N} plan(s). Files on disk.`
- If `--skip-verify`: Skip to step 13
- Check config: `WORKFLOW_PLAN_CHECK=$(cat .planning/config.json 2>/dev/null | grep -o '"plan_check"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")`
- If `workflow.plan_check` is `false`: Skip to step 13
- Otherwise: Proceed to step 10

**`## CHECKPOINT REACHED`:**
- Present to user, get response, spawn continuation (see step 12)

**`## PLANNING INCONCLUSIVE`:**
- Show what was attempted
- Ask how to proceed in natural language. Suggest: add context, retry, or stop planning.
- Wait for user response

## 10. Spawn gsd-plan-checker Agent

Read plans and requirements for the checker:

- Use `read` to load all `${PHASE_DIR}/*-PLAN.md` files (concatenate in order)
- Use `read` for `.planning/REQUIREMENTS.md` if present

Fill checker prompt with inlined content and spawn:

```markdown
<verification_context>

**Phase:** {phase_number}
**Phase Goal:** {goal from ROADMAP}

**Plans to verify:**
{plans_content}

**Requirements (if exists):**
{requirements_content}

</verification_context>

<expected_output>
Return one of:
- ## VERIFICATION PASSED — all checks pass
- ## ISSUES FOUND — structured issue list
</expected_output>
```

```
Task(
  prompt=checker_prompt,
  subagent_type="gsd-plan-checker",
  description="Verify Phase {phase} plans"
)
```

## 11. Handle Checker Return

**If `## VERIFICATION PASSED`:**
- Display: `Plans verified. Ready for execution.`
- Proceed to step 13

**If `## ISSUES FOUND`:**
- Display: `Checker found issues:`
- List issues from checker output
- Check iteration count
- Proceed to step 12

## 12. Revision Loop (Max 3 Iterations)

Track: `iteration_count` (starts at 1 after initial plan + check)

**If iteration_count < 3:**

Display: `Sending back to planner for revision... (iteration {N}/3)`

Read current plans for revision context:

```bash
PLANS_CONTENT=$(cat "${PHASE_DIR}"/*-PLAN.md 2>/dev/null)
```

If present, read review file:
`read ${PHASE_DIR}/${PHASE}-REVIEW.md`

Spawn gsd-planner with revision prompt:

```markdown
<revision_context>

**Phase:** {phase_number}
**Mode:** revision

**Existing plans:**
{plans_content}

**Review file (if exists):**
{review_content}

**Checker issues:**
{structured_issues_from_checker}

</revision_context>

<instructions>
Make targeted updates to address checker issues.
Do NOT replan from scratch unless issues are fundamental.
Return what changed.
</instructions>
```

```
Task(
  prompt=revision_prompt,
  subagent_type="gsd-planner",
  description="Revise Phase {phase} plans"
)
```

- After planner returns → spawn checker again (step 10)
- Increment iteration_count

**If iteration_count >= 3:**

Display: `Max iterations reached. {N} issues remain:`
- List remaining issues

Ask for guidance in natural language:
"How would you like to proceed? You can approve with known issues, give direction to revise, or pause planning."

Wait for user response.

## 13. Plan Review (Interactive Mode)

Ensure review file exists:

- Path: `${PHASE_DIR}/${PHASE}-REVIEW.md`
- If missing: create from `~/.config/opencode/get-shit-done/templates/phase-review.md` and fill in phase name, mode, and date

If `WORKFLOW_MODE=interactive`:

- Present where to review:
  - `${PHASE_DIR}/*-PLAN.md`
  - `${PHASE_DIR}/${PHASE}-REVIEW.md`
- Ask for freeform feedback:
  "Review the plans and review file. Reply with questions, comments, or edits you want. Say `approve` when ready."
  Treat the user as a collaborator: welcome critique and challenge assumptions.

**If user replies `approve`:** Proceed to step 14.

**If user provides feedback:**

- Read current plans and review file
- Spawn `gsd-planner` in revision mode with user feedback:

```markdown
<revision_context>

**Phase:** {phase_number}
**Mode:** revision_user_feedback

**Existing plans:**
{plans_content}

**Review file:**
{review_content}

**User feedback:**
{user_feedback}

</revision_context>

<instructions>
Revise plans and review file based on user feedback.
Preserve user-authored sections in REVIEW.md.
Return what changed.
</instructions>
```

- After planner returns: if plan-checker enabled, run step 10 again
- Loop back to step 13

If `WORKFLOW_MODE=yolo`: Skip review and proceed to step 14.

## 14. Present Final Status

Route to `<offer_next>`.

</process>

<offer_next>
Output this markdown directly (not as a code block):

**Phase {X}: {Name}** — {N} plan(s) in {M} wave(s)

| Wave | Plans | What it builds |
|------|-------|----------------|
| 1    | 01, 02 | [objectives] |
| 2    | 03     | [objective]  |

Research: {Completed | Used existing | Skipped}
Verification: {Passed | Passed with override | Skipped}

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Execute Phase {X}** — run all {N} plans

/gsd-execute-phase {X}

<sub>/clear first → fresh context window</sub>

───────────────────────────────────────────────────────────────

**Also available:**
- cat .planning/phases/{phase-dir}/*-PLAN.md — review plans
- cat .planning/phases/{phase-dir}/{phase}-REVIEW.md — review notes and decisions
- /gsd-plan-phase {X} --research — re-research first

───────────────────────────────────────────────────────────────
</offer_next>

<success_criteria>
- [ ] .planning/ directory validated
- [ ] Phase validated against roadmap
- [ ] Phase directory created if needed
- [ ] Research completed (unless --skip-research or --gaps or exists)
- [ ] gsd-phase-researcher spawned if research needed
- [ ] Existing plans checked
- [ ] gsd-planner spawned with context (including RESEARCH.md if available)
- [ ] Plans created (PLANNING COMPLETE or CHECKPOINT handled)
- [ ] gsd-plan-checker spawned (unless --skip-verify)
- [ ] Verification passed OR user override OR max iterations with user decision
- [ ] Review file updated
- [ ] User review completed (interactive mode) or skipped (yolo mode)
- [ ] User sees status between agent spawns
- [ ] User knows next steps (execute or review)
</success_criteria>
