---
description: Gather phase context through adaptive questioning before planning
argument-hint: "<phase>"
tools:
  read: true
  write: true
  bash: true
  glob: true
  grep: true
  question: true
---

<objective>
Extract implementation decisions that downstream agents need — researcher and planner will use CONTEXT.md to know what to investigate and what choices are locked.

**How it works:**
1. Analyze the phase to identify gray areas (UI, UX, behavior, etc.)
2. Present gray areas — user chooses in natural language
3. Deep-dive each selected area until satisfied
4. Create CONTEXT.md with decisions that guide research and planning
5. In interactive mode, review CONTEXT.md and revise based on user feedback

**Output:** `{phase}-CONTEXT.md` — decisions clear enough that downstream agents can act without asking the user again
</objective>

<execution_context>
@~/.config/opencode/get-shit-done/workflows/discuss-phase.md
@~/.config/opencode/get-shit-done/templates/context.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**Load project state:**
@.planning/STATE.md

**Load roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. Validate phase number (error if missing or not in roadmap)
2. Check if CONTEXT.md exists (offer update/view/skip if yes)
3. **Analyze phase** — Identify domain and generate phase-specific gray areas
4. **Present gray areas** — Ask which to discuss in natural language (use question tool only if needed)
5. **Deep-dive each area** — probe until satisfied
6. **Write CONTEXT.md** — Sections match areas discussed
7. **Review CONTEXT.md** — mandatory in interactive mode, optional in yolo
8. Offer next steps (research or plan)

**CRITICAL: Scope guardrail**
- Phase boundary from ROADMAP.md is FIXED
- Discussion clarifies HOW to implement, not WHETHER to add more
- If user suggests new capabilities: "That's its own phase. I'll note it for later."
- Capture deferred ideas — don't lose them, don't act on them

**Domain-aware gray areas:**
Gray areas depend on what's being built. Analyze the phase goal:
- Something users SEE → layout, density, interactions, states
- Something users CALL → responses, errors, auth, versioning
- Something users RUN → output format, flags, modes, error handling
- Something users READ → structure, tone, depth, flow
- Something being ORGANIZED → criteria, grouping, naming, exceptions

Generate 3-4 **phase-specific** gray areas, not generic categories.

**Probing depth:**
- Ask 4 questions per area before checking
- "More questions about [area], or move to next?"
- If more → ask 4 more, check again
- After all areas → "Ready to create context?"

**Default to user-facing decisions.** Avoid leading with deep technical implementation, architecture, or performance questions.
If the user raises technical constraints or preferences, capture them.
</process>

<success_criteria>
- Gray areas identified through intelligent analysis
- User chose which areas to discuss
- Each selected area explored until satisfied
- Scope creep redirected to deferred ideas
- CONTEXT.md captures decisions, not vague vision
- User knows next steps
</success_criteria>
