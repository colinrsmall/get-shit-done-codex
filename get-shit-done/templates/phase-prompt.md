# Phase Prompt Template

> **Note:** Planning methodology is in `agents/gsd-planner.md`.
> This template defines the PLAN.md output format that the agent produces.

Template for `.planning/phases/XX-name/{phase}-{plan}-PLAN.md` - executable phase plans optimized for parallel execution.

**Naming:** Use `{phase}-{plan}-PLAN.md` format (e.g., `01-02-PLAN.md` for Phase 1, Plan 2)

---

## File Template

```markdown
---
phase: XX-name
plan: NN
type: execute
wave: N                     # Execution wave (1, 2, 3...). Pre-computed at plan time.
depends_on: []              # Plan IDs this plan requires (e.g., ["01-01"]).
files_modified: []          # Allowlist of files this plan is expected to touch.
may_touch_globs: []         # Optional glob patterns for likely extra touches.
locks: []                   # Shared resource locks (parallel safety).
autonomous: true            # false if plan has checkpoints requiring user interaction
user_setup: []              # Human-required setup assistant cannot automate (see below)

# Goal-backward verification (derived during planning, verified after execution)
must_haves:
  truths: []                # Observable behaviors that must be true for goal achievement
  artifacts: []             # Files that must exist with real implementation
  key_links: []             # Critical connections between artifacts
---

## Objective

[What this plan accomplishes]

Purpose: [Why this matters for the project]
Output: [What artifacts will be created]

## Execution Context

- @~/.config/opencode/get-shit-done/workflows/execute-plan.md
- @~/.config/opencode/get-shit-done/templates/summary.md
- If this plan contains any checkpoint tasks, also include:
  - @~/.config/opencode/get-shit-done/references/checkpoints.md

## Context

- @.planning/PROJECT.md
- @.planning/ROADMAP.md
- @.planning/STATE.md

Only reference prior plan SUMMARYs if genuinely needed:
- This plan uses types/exports from a prior plan
- A prior plan made a decision that constrains this plan

Do NOT reflexively chain: plan 02 refs 01, plan 03 refs 02.

Relevant source files (only if needed):
- @src/path/to/relevant.ts

## Tasks

For command-only tasks (start dev server, run migrations), use `**Files:** (none)`.

### Task 1: [Action-oriented name]

**Type:** `auto`
**Files:** `path/to/file.ext`, `another/file.ext`
**Action:**
- [Specific implementation - what to do, how to do it, what to avoid and why]
**Verify:**
- `[Command or check to prove it worked]`
**Done When:**
- [Measurable acceptance criteria]

### Task 2: [Action-oriented name]

**Type:** `auto`
**Files:** `path/to/file.ext`
**Action:**
- [Specific implementation]
**Verify:**
- `[Command or check]`
**Done When:**
- [Acceptance criteria]

### Task 3: [Decision checkpoint]

**Type:** `checkpoint:decision`
**Gate:** `blocking`
**Decision Needed:** [What needs deciding]
**Context:** [Why this decision matters]
**Options:**
- `option-a`: Pros: [benefits]. Cons: [tradeoffs].
- `option-b`: Pros: [benefits]. Cons: [tradeoffs].
**Resume Signal:** Select `option-a` or `option-b`.

### Task 4: [Human verification checkpoint]

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** [What the assistant built] (URL: [http://localhost:3000])
**How To Verify:**
1. Visit [URL]
2. Verify: [visual/functional checks only, NO CLI commands]
**Resume Signal:** Reply with `approved` or describe issues.

## Verification

Before declaring plan complete:
- [ ] [Specific test command]
- [ ] [Build/type check passes]
- [ ] [Behavior verification]

## Success Criteria

- All tasks completed
- All verification checks pass
- No errors or warnings introduced
- [Plan-specific criteria]

## Output

After completion, create `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`
```

---

## Frontmatter Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `phase` | Yes | Phase identifier (e.g., `01-foundation`) |
| `plan` | Yes | Plan number within phase (e.g., `01`, `02`) |
| `type` | Yes | Always `execute` for standard plans, `tdd` for TDD plans |
| `wave` | Yes | Execution wave number (1, 2, 3...). Pre-computed at plan time. |
| `depends_on` | Yes | Array of plan IDs this plan requires. |
| `files_modified` | Yes | Allowlist of files this plan is expected to touch. |
| `may_touch_globs` | No | Globs for likely extra touches (shared harness/config). |
| `locks` | No | Shared resource locks to prevent parallel conflicts. |
| `autonomous` | Yes | `true` if no checkpoints, `false` if has checkpoints |
| `user_setup` | No | Array of human-required setup items (external services) |
| `must_haves` | Yes | Goal-backward verification criteria (see below) |

**Wave is pre-computed:** Wave numbers are assigned during `/gsd-plan-phase`. Execute-phase reads `wave` directly from frontmatter and groups plans by wave number. No runtime dependency analysis needed.

**Parallel safety:** `files_modified` is an allowlist. Use `locks` for shared resources (`deps`, `tests-harness`, `ci-config`, `app-config`, `planning-docs`). Use `may_touch_globs` for commonly required shared files like `tests/**/conftest.*` or lockfiles.

**Must-haves enable verification:** The `must_haves` field carries goal-backward requirements from planning to execution. After all plans complete, execute-phase spawns a verification subagent that checks these criteria against the actual codebase.

---

## Parallel vs Sequential

<parallel_examples>

**Wave 1 candidates (parallel):**

```yaml
# Plan 01 - User feature
wave: 1
depends_on: []
files_modified: [src/models/user.ts, src/api/users.ts]
locks: []
autonomous: true

# Plan 02 - Product feature (no overlap with Plan 01)
wave: 1
depends_on: []
files_modified: [src/models/product.ts, src/api/products.ts]
locks: []
autonomous: true

# Plan 03 - Order feature (no overlap)
wave: 1
depends_on: []
files_modified: [src/models/order.ts, src/api/orders.ts]
locks: []
autonomous: true
```

All three run in parallel (Wave 1) - no dependencies, no file conflicts, no shared locks.

**Sequential (genuine dependency):**

```yaml
# Plan 01 - Auth foundation
wave: 1
depends_on: []
files_modified: [src/lib/auth.ts, src/middleware/auth.ts]
locks: [app-config]
autonomous: true

# Plan 02 - Protected features (needs auth)
wave: 2
depends_on: ["01"]
files_modified: [src/features/dashboard.ts]
locks: []
autonomous: true
```

Plan 02 in Wave 2 waits for Plan 01 in Wave 1 - genuine dependency on auth types/middleware.

**Checkpoint plan:**

```yaml
# Plan 03 - UI with verification
wave: 3
depends_on: ["01", "02"]
files_modified: [src/components/Dashboard.tsx]
locks: []
autonomous: false  # Has checkpoint:human-verify
```

Wave 3 runs after Waves 1 and 2. Pauses at checkpoint, orchestrator presents to user, resumes on approval.

</parallel_examples>

---

## Context Section

**Parallel-aware context:**

```markdown
<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

# Only include SUMMARY refs if genuinely needed:
# - This plan imports types from prior plan
# - Prior plan made decision affecting this plan
# - Prior plan's output is input to this plan
#
# Independent plans need NO prior SUMMARY references.
# Do NOT reflexively chain: 02 refs 01, 03 refs 02...

@src/relevant/source.ts
</context>
```

**Bad pattern (creates false dependencies):**
```markdown
<context>
@.planning/phases/03-features/03-01-SUMMARY.md  # Just because it's earlier
@.planning/phases/03-features/03-02-SUMMARY.md  # Reflexive chaining
</context>
```

---

## Scope Guidance

**Plan sizing:**

- 2-3 tasks per plan
- ~50% context usage maximum
- Complex phases: Multiple focused plans, not one large plan

**When to split:**

- Different subsystems (auth vs API vs UI)
- >3 tasks
- Risk of context overflow
- TDD candidates - separate plans

**Vertical slices preferred:**

```
PREFER: Plan 01 = User (model + API + UI)
        Plan 02 = Product (model + API + UI)

AVOID:  Plan 01 = All models
        Plan 02 = All APIs
        Plan 03 = All UIs
```

---

## TDD Plans

TDD features get dedicated plans with `type: tdd`.

**Heuristic:** Can you write `expect(fn(input)).toBe(output)` before writing `fn`?
→ Yes: Create a TDD plan
→ No: Standard task in standard plan

See `~/.config/opencode/get-shit-done/references/tdd.md` for TDD plan structure.

---

## Task Types

| Type | Use For | Autonomy |
|------|---------|----------|
| `auto` | Everything the assistant can do independently | Fully autonomous |
| `checkpoint:human-verify` | Visual/functional verification | Pauses, returns to orchestrator |
| `checkpoint:decision` | Implementation choices | Pauses, returns to orchestrator |
| `checkpoint:human-action` | Truly unavoidable manual steps (rare) | Pauses, returns to orchestrator |

**Checkpoint behavior in parallel execution:**
- Plan runs until checkpoint
- Agent returns with checkpoint details
- Orchestrator presents to user
- User responds
- Orchestrator spawns a fresh continuation agent (not resume)

---

## Examples

**Autonomous parallel plan:**

```markdown
---
phase: 03-features
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/features/user/model.ts
  - src/features/user/api.ts
  - src/features/user/UserList.tsx
may_touch_globs: []
locks: []
autonomous: true
---

## Objective

Implement complete User feature as a vertical slice.

Purpose: Self-contained user management that can run parallel to other features.
Output: User model, API endpoints, and UI components.

## Context

- @.planning/PROJECT.md
- @.planning/ROADMAP.md
- @.planning/STATE.md

## Tasks

### Task 1: Create User model

**Type:** `auto`
**Files:** `src/features/user/model.ts`
**Action:**
- Define `User` type with `id`, `email`, `name`, `createdAt`.
- Export TypeScript interface/type from the module.
**Verify:**
- `tsc --noEmit` passes
**Done When:**
- User type is exported and used by API layer

### Task 2: Create User API endpoints

**Type:** `auto`
**Files:** `src/features/user/api.ts`
**Action:**
- Implement `GET /users` (list), `GET /users/:id` (single), `POST /users` (create).
- Use `User` type from the model.
**Verify:**
- Curl tests pass for all endpoints
**Done When:**
- All required endpoints respond correctly

## Verification

- [ ] `npm run build` succeeds
- [ ] API endpoints respond correctly

## Success Criteria

- All tasks completed
- User feature works end-to-end

## Output

After completion, create `.planning/phases/03-features/03-01-SUMMARY.md`
```

**Plan with checkpoint (non-autonomous):**

```markdown
---
phase: 03-features
plan: 03
type: execute
wave: 2
depends_on: ["03-01", "03-02"]
files_modified: [src/components/Dashboard.tsx]
may_touch_globs: []
locks: []
autonomous: false
---

## Objective

Build dashboard with visual verification.

Purpose: Integrate user and product features into a unified view.
Output: Working dashboard component.

## Execution Context

- @~/.config/opencode/get-shit-done/workflows/execute-plan.md
- @~/.config/opencode/get-shit-done/templates/summary.md
- @~/.config/opencode/get-shit-done/references/checkpoints.md

## Context

- @.planning/PROJECT.md
- @.planning/ROADMAP.md
- @.planning/phases/03-features/03-01-SUMMARY.md
- @.planning/phases/03-features/03-02-SUMMARY.md

## Tasks

### Task 1: Build Dashboard layout

**Type:** `auto`
**Files:** `src/components/Dashboard.tsx`
**Action:**
- Create responsive grid with `UserList` and `ProductList` components.
- Use Tailwind for styling.
**Verify:**
- `npm run build` succeeds
**Done When:**
- Dashboard renders without errors

### Task 2: Start dev server

**Type:** `auto`
**Files:** (none)
**Action:**
- Run `npm run dev` in background and wait until ready.
**Verify:**
- `curl localhost:3000` returns 200
**Done When:**
- Dev server is running locally

### Task 3: Human verification - dashboard layout

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** Dashboard server at http://localhost:3000
**How To Verify:**
1. Visit `http://localhost:3000/dashboard`
2. Check: desktop grid, mobile stack, no scroll issues
**Resume Signal:** Reply with `approved` or describe layout issues.

## Verification

- [ ] `npm run build` succeeds
- [ ] Visual verification passed

## Success Criteria

- All tasks completed
- User approved visual layout

## Output

After completion, create `.planning/phases/03-features/03-03-SUMMARY.md`
```

---

## Anti-Patterns

**Bad: Reflexive dependency chaining**
```yaml
depends_on: ["03-01"]  # Just because 01 comes before 02
```

**Bad: Horizontal layer grouping**
```
Plan 01: All models
Plan 02: All APIs (depends on 01)
Plan 03: All UIs (depends on 02)
```

**Bad: Missing autonomy flag**
```yaml
# Has checkpoint but no autonomous: false
depends_on: []
files_modified: [...]
# autonomous: ???  <- Missing!
```

**Bad: Vague tasks**
```markdown
### Task 1: Set up authentication

**Type:** `auto`
**Action:**
- Add auth to the app
```

---

## Guidelines

- Always use this Markdown plan schema: required `##` sections + `### Task N:` blocks + `**Key:**` fields
- Include `wave`, `depends_on`, `files_modified`, `may_touch_globs`, `locks`, `autonomous` in every plan
- Prefer vertical slices over horizontal layers
- Only reference prior SUMMARYs when genuinely needed
- Group checkpoints with related auto tasks in same plan
- 2-3 tasks per plan, ~50% context max

---

## User Setup (External Services)

When a plan introduces external services requiring human configuration, declare in frontmatter:

```yaml
user_setup:
  - service: stripe
    why: "Payment processing requires API keys"
    env_vars:
      - name: STRIPE_SECRET_KEY
        source: "Stripe Dashboard → Developers → API keys → Secret key"
      - name: STRIPE_WEBHOOK_SECRET
        source: "Stripe Dashboard → Developers → Webhooks → Signing secret"
    dashboard_config:
      - task: "Create webhook endpoint"
        location: "Stripe Dashboard → Developers → Webhooks → Add endpoint"
        details: "URL: https://[your-domain]/api/webhooks/stripe"
    local_dev:
      - "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
```

**The automation-first rule:** `user_setup` contains ONLY what the assistant literally cannot do:
- Account creation (requires human signup)
- Secret retrieval (requires dashboard access)
- Dashboard configuration (requires human in browser)

**NOT included:** Package installs, code changes, file creation, CLI commands the assistant can run.

**Result:** Execute-plan generates `{phase}-USER-SETUP.md` with checklist for the user.

See `~/.config/opencode/get-shit-done/templates/user-setup.md` for full schema and examples

---

## Must-Haves (Goal-Backward Verification)

The `must_haves` field defines what must be TRUE for the phase goal to be achieved. Derived during planning, verified after execution.

**Structure:**

```yaml
must_haves:
  truths:
    - "User can see existing messages"
    - "User can send a message"
    - "Messages persist across refresh"
  artifacts:
    - path: "src/components/Chat.tsx"
      provides: "Message list rendering"
      min_lines: 30
    - path: "src/app/api/chat/route.ts"
      provides: "Message CRUD operations"
      exports: ["GET", "POST"]
    - path: "prisma/schema.prisma"
      provides: "Message model"
      contains: "model Message"
  key_links:
    - from: "src/components/Chat.tsx"
      to: "/api/chat"
      via: "fetch in useEffect"
      pattern: "fetch.*api/chat"
    - from: "src/app/api/chat/route.ts"
      to: "prisma.message"
      via: "database query"
      pattern: "prisma\\.message\\.(find|create)"
```

**Field descriptions:**

| Field | Purpose |
|-------|---------|
| `truths` | Observable behaviors from user perspective. Each must be testable. |
| `artifacts` | Files that must exist with real implementation. |
| `artifacts[].path` | File path relative to project root. |
| `artifacts[].provides` | What this artifact delivers. |
| `artifacts[].min_lines` | Optional. Minimum lines to be considered substantive. |
| `artifacts[].exports` | Optional. Expected exports to verify. |
| `artifacts[].contains` | Optional. Pattern that must exist in file. |
| `key_links` | Critical connections between artifacts. |
| `key_links[].from` | Source artifact. |
| `key_links[].to` | Target artifact or endpoint. |
| `key_links[].via` | How they connect (description). |
| `key_links[].pattern` | Optional. Regex to verify connection exists. |

**Why this matters:**

Task completion ≠ Goal achievement. A task "create chat component" can complete by creating a placeholder. The `must_haves` field captures what must actually work, enabling verification to catch gaps before they compound.

**Verification flow:**

1. Plan-phase derives must_haves from phase goal (goal-backward)
2. Must_haves written to PLAN.md frontmatter
3. Execute-phase runs all plans
4. Verification subagent checks must_haves against codebase
5. Gaps found → fix plans created → execute → re-verify
6. All must_haves pass → phase complete

See `~/.config/opencode/get-shit-done/workflows/verify-phase.md` for verification logic.
