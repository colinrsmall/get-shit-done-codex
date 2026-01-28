# GSD-STYLE.md

> **Comprehensive reference.** This document provides deep explanations and examples for when you need the full picture.

This document explains how GSD is written so future assistant instances can contribute consistently.

## Core Philosophy

GSD is a **meta-prompting system** where every file is both implementation and specification. Files teach the assistant how to build software systematically. The system optimizes for:

- **Solo developer + assistant workflow** (no enterprise patterns)
- **Context engineering** (manage the assistant's context window deliberately)
- **Plans as prompts** (PLAN.md files are executable, not documents to transform)

---

## File Structure Conventions

### Slash Commands (`commands/gsd-*.md`)

```yaml
---
description: One-line description
argument-hint: "<required>" or "[optional]"
tools:
  read: true
  write: true
  bash: true
  glob: true
  grep: true
  question: true
---
```

**Section order:**
1. `<objective>` — What/why/when (always present)
2. `<execution_context>` — @-references to workflows, templates, references
3. `<context>` — Dynamic content: `$ARGUMENTS`, bash output, @file refs
4. `<process>` or `<step>` elements — Implementation steps
5. `<success_criteria>` — Measurable completion checklist

**Commands are thin wrappers.** Delegate detailed logic to workflows.

### Workflows (`get-shit-done/workflows/*.md`)

No YAML frontmatter. Structure varies by workflow.

**Common tags** (not all workflows use all of these):
- `<purpose>` — What this workflow accomplishes
- `<when_to_use>` or `<trigger>` — Decision criteria
- `<required_reading>` — Prerequisite files
- `<process>` — Container for steps
- `<step>` — Individual execution step

Some workflows use domain-specific tags like `<philosophy>`, `<references>`, `<planning_principles>`, `<decimal_phase_numbering>`.

**When using `<step>` elements:**
- `name` attribute: snake_case (e.g., `name="load_project_state"`)
- `priority` attribute: Optional ("first", "second")

**Key principle:** Match the style of the specific workflow you're editing.

### Templates (`get-shit-done/templates/*.md`)

Structure varies. Common patterns:
- Most start with `# [Name] Template` header
- Many include a `<template>` block with the actual template content
- Some include examples or guidelines sections

**Placeholder conventions:**
- Square brackets: `[Project Name]`, `[Description]`
- Curly braces: `{phase}-{plan}-PLAN.md`

### References (`get-shit-done/references/*.md`)

Typically use outer XML containers related to filename, but structure varies.

Examples:
- `principles.md` → `<principles>...</principles>`
- `checkpoints.md` → `<overview>` then `<checkpoint_types>`
- `phase-prompt.md` → canonical PLAN.md schema (Markdown sections + task blocks)

Internal organization varies — semantic sub-containers, markdown headers within XML, code examples.

---

## Tag Conventions (Commands/Workflows)

Commands and workflows use semantic tags (e.g., `<objective>`, `<execution_context>`) as lightweight containers.

**Plan files are different:** `*-PLAN.md` files are pure Markdown sections and task blocks (no XML tags). See `get-shit-done/templates/phase-prompt.md`.

### Semantic Containers Only

XML tags serve semantic purposes. Use Markdown headers for hierarchy within.

**DO:**
```xml
<objective>
## Primary Goal
Build authentication system

## Success Criteria
- Users can log in
- Sessions persist
</objective>
```

**DON'T:**
```xml
<section name="objective">
  <subsection name="primary-goal">
    <content>Build authentication system</content>
  </subsection>
</section>
```

### Task Structure

```markdown
### Task N: Action-oriented name

**Type:** `auto`
**Files:** `src/path/file.ts`, `src/other/file.ts`
**Action:**
- What to do, what to avoid, and why
**Verify:**
- `command or check to prove completion`
**Done When:**
- Measurable acceptance criteria
```

**Task types:**
- `auto` — assistant executes autonomously
- `checkpoint:human-verify` — User must verify
- `checkpoint:decision` — User must choose

### Checkpoint Structure

```markdown
### Task N: Human verification - short name

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** Description of what was built (URL: http://localhost:3000)
**How To Verify:**
1. Numbered steps for user
**Resume Signal:** Reply with `approved` or describe issues.

### Task N: Decision - short name

**Type:** `checkpoint:decision`
**Gate:** `blocking`
**Decision Needed:** What needs deciding
**Context:** Why this matters
**Options:**
- `option-a`: Pros: benefits. Cons: tradeoffs.
- `option-b`: Pros: benefits. Cons: tradeoffs.
**Resume Signal:** Select `option-a` or `option-b`.
```

### Conditional Logic

```xml
<if mode="yolo">
  Content for yolo mode
</if>

<if mode="interactive" OR="custom with gates.execute_next_plan true">
  Content for multiple conditions
</if>
```

---

## @-Reference Patterns

**Static references** (always load):
```
@~/.config/opencode/get-shit-done/workflows/execute-phase.md
@.planning/PROJECT.md
```

**Conditional references** (based on existence):
```
@.planning/DISCOVERY.md (if exists)
```

**@-references are lazy loading signals.** They tell the assistant what to read, not pre-loaded content.

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `execute-phase.md` |
| Commands | `/gsd-kebab-case` | `/gsd-execute-phase` |
| XML tags | kebab-case | `<execution_context>` |
| Step names | snake_case | `name="load_project_state"` |
| Bash variables | CAPS_UNDERSCORES | `PHASE_ARG`, `PLAN_START_TIME` |
| Task types | colon separator | `checkpoint:human-verify` |

---

## Language & Tone

### Imperative Voice

**DO:** "Execute tasks", "Create file", "Read STATE.md"

**DON'T:** "Execution is performed", "The file should be created"

### No Filler

Absent: "Let me", "Just", "Simply", "Basically", "I'd be happy to"

Present: Direct instructions, technical precision

### No Sycophancy

Absent: "Great!", "Awesome!", "Excellent!", "I'd love to help"

Present: Factual statements, verification results, direct answers

### Brevity with Substance

**Good one-liner:** "JWT auth with refresh rotation using jose library"

**Bad one-liner:** "Phase complete" or "Authentication implemented"

---

## Context Engineering

### Size Constraints

- **Plans:** 2-3 tasks maximum
- **Quality curve:** 0-30% peak, 30-50% good, 50-70% degrading, 70%+ poor
- **Split triggers:** >3 tasks, multiple subsystems, >5 files per task

### Fresh Context Pattern

Use subagents for autonomous work. Reserve main context for user interaction.

### State Preservation

- `STATE.md` — Living memory across sessions
- `agent-history.json` — Subagent tracking for resume
- SUMMARY.md frontmatter — Machine-readable for dependency graphs

---

## Anti-Patterns to Avoid

### Enterprise Patterns (Banned)

- Story points, sprint ceremonies, RACI matrices
- Human dev time estimates (days/weeks)
- Team coordination, knowledge transfer docs
- Change management processes

### Temporal Language (Banned in Implementation Docs)

**DON'T:** "We changed X to Y", "Previously", "No longer", "Instead of"

**DO:** Describe current state only

**Exception:** CHANGELOG.md, MIGRATION.md, git commits

### Generic XML (Banned)

**DON'T:** `<section>`, `<item>`, `<content>`

**DO:**
- Commands/workflows: semantic purpose tags like `<objective>`, `<execution_context>`, `<process>`
- Plan files: Markdown sections (`## Objective`, `## Tasks`, `## Verification`) and task blocks (see `get-shit-done/templates/phase-prompt.md`)

### Vague Tasks (Banned)

```markdown
<!-- BAD -->
### Task N: Add authentication

**Type:** `auto`
**Action:**
- Implement auth
**Verify:**
- ???

<!-- GOOD -->
### Task N: Create login endpoint with JWT

**Type:** `auto`
**Files:** `src/app/api/auth/login/route.ts`
**Action:**
- Implement POST endpoint accepting `{email, password}`.
- Query `User` by email and compare password with bcrypt.
- On match: create JWT with jose, set as httpOnly cookie, return 200.
- On mismatch: return 401.
**Verify:**
- `curl -X POST localhost:3000/api/auth/login` returns 200 with `Set-Cookie` header
**Done When:**
- Valid credentials -> 200 + cookie; invalid -> 401
```

---

## Commit Conventions

See `get-shit-done/references/git-integration.md` for commit points, formats, and types.

---

## UX Patterns

### "Next Up" Format

See `get-shit-done/references/continuation-format.md` for the canonical format and variants.

### Decision Gates

Default to natural language dialogue. Use the question tool when you need a discrete decision to proceed.

Include escape hatch: "Something else", "Let me describe"

---

## Progressive Disclosure

Information flows through layers:

1. **Command** — High-level objective, delegates to workflow
2. **Workflow** — Detailed process, references templates/references
3. **Template** — Concrete structure with placeholders
4. **Reference** — Deep dive on specific concept

Each layer answers different questions:
- Command: "Should I use this?"
- Workflow: "What happens?"
- Template: "What does output look like?"
- Reference: "Why this design?"

---

## Depth & Compression

Depth setting controls compression tolerance:

- **Quick:** Compress aggressively (1-3 plans/phase)
- **Standard:** Balanced (3-5 plans/phase)
- **Comprehensive:** Resist compression (5-10 plans/phase)

**Key principle:** Depth controls compression, not inflation. Never pad to hit a target number. Derive plans from actual work.

---

## Quick Mode Patterns

Quick mode provides GSD guarantees for ad-hoc tasks without full planning overhead.

### When to Use Quick Mode

**Quick mode:**
- Task is small and self-contained
- You know exactly what to do (no research needed)
- Task doesn't warrant full phase planning
- Mid-project fixes or small additions

**Full planning:**
- Task involves multiple subsystems
- You need to investigate approach first
- Task is part of a larger phase
- Task might have hidden complexity

### Quick Task Structure

```
.planning/quick/
├── 001-add-dark-mode/
│   ├── PLAN.md
│   └── SUMMARY.md
├── 002-fix-login-bug/
│   ├── PLAN.md
│   └── SUMMARY.md
```

Numbering: 3-digit sequential (001, 002, 003...)
Slug: kebab-case from description, max 40 chars

### Quick Mode Tracking

Quick tasks update STATE.md, NOT ROADMAP.md:

```markdown
### Quick Tasks Completed

| # | Description | Date | Commits | Directory |
|---|-------------|------|--------|-----------|
| 001 | Add dark mode toggle | 2026-01-19 | abc123f | [001-add-dark-mode](./quick/001-add-dark-mode/) |
```

### Quick Mode Orchestration

Unlike full phases, quick mode orchestration is inline in the command file — no separate workflow. The simplified flow:

1. Validate ROADMAP.md exists (project active)
2. Get task description
3. Spawn planner (quick constraints)
4. Spawn executor
5. Update STATE.md
6. Commit artifacts

### Commit Convention

```
docs(quick-NNN): description

Quick task completed.

Co-Authored-By: Assistant <noreply@example.com>
```

---

## TDD Plans

See `get-shit-done/references/tdd.md` for heuristics, plan structure, and commit patterns.

---

## Summary: Core Meta-Patterns

1. **XML for semantic structure, Markdown for content**
2. **@-references are lazy loading signals**
3. **Commands delegate to workflows**
4. **Progressive disclosure hierarchy**
5. **Imperative, brief, technical** — no filler, no sycophancy
6. **Solo developer + assistant** — no enterprise patterns
7. **Context size as quality constraint** — split aggressively
8. **Temporal language banned** — current state only
9. **Plans ARE prompts** — executable, not documents
10. **Atomic code commits (when requested)** — Git history as context source
11. **question tool for exploration** — always options
12. **Checkpoints post-automation** — automate first, verify after
13. **Deviation rules are automatic** — no permission for bugs/critical
14. **Depth controls compression** — derive from actual work
15. **TDD gets dedicated plans** — cycle too heavy to embed
