<div align="center">

# GET SHIT DONE

**A lightweight meta-prompting, context engineering, and spec-driven development system for OpenCode.**

This version is OpenCode-first: Claude-era coupling has been removed, and planning is explicitly collaborative with natural-language review loops.

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/5JJgD5svVS)
[![GitHub stars](https://img.shields.io/github/stars/glittercowboy/get-shit-done?style=for-the-badge&logo=github&color=181717)](https://github.com/glittercowboy/get-shit-done)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## Install (Manual)

Copy these folders into your OpenCode config directory:

- `commands/` → `~/.config/opencode/command/`
- `agents/` → `~/.config/opencode/agents/`
- `get-shit-done/` → `~/.config/opencode/get-shit-done/`
- `hooks/` → `~/.config/opencode/hooks/` (optional)

Example:

```bash
mkdir -p ~/.config/opencode/{command,agents,get-shit-done,hooks}
cp -R commands/* ~/.config/opencode/command/
cp -R agents/* ~/.config/opencode/agents/
cp -R get-shit-done/* ~/.config/opencode/get-shit-done/
cp -R hooks/* ~/.config/opencode/hooks/
```

Restart OpenCode, then run:

```
/gsd-help
```

---

## Quick Start

1. `/gsd-new-project` - Initialize project (questions -> research -> requirements -> roadmap)
2. `/gsd-discuss-phase 1` - Capture phase decisions (recommended)
3. `/gsd-plan-phase 1` - Create detailed plans for Phase 1 (review required in interactive mode)
4. `/gsd-execute-phase 1` - Execute Phase 1

---

## Commands

Run `/gsd-help` for the complete command reference.

---

## Configuration

GSD stores project settings in `.planning/config.json`.

- Use `/gsd-settings` to toggle workflow agents (researcher, plan checker, verifier).
- Edit agent headers in `agents/*.md` to change which model each agent uses.
- `mode: interactive` requires human review loops; `mode: yolo` auto-approves.

---

## Planning Collaboration (New)

GSD now treats planning as a deliberate, user-reviewed loop instead of auto-approval.

- Interactive mode requires review and approval for project artifacts and phase plans.
- Feedback is natural language; the agent revises and re-presents until approved.
- Requirements, roadmap, and phase context (CONTEXT.md) are now reviewed explicitly.
- Review artifacts are persistent and editable:
  - `.planning/PROJECT-REVIEW.md`
  - `.planning/phases/XX-name/XX-REVIEW.md`

---

## Plan Format (New)

Plan files (`.planning/phases/*/*-PLAN.md`) are now pure Markdown (no XML task tags) and are designed to be both human-readable and machine-readable:

- Machine-readable: YAML frontmatter (wave, depends_on, files_modified, autonomous, must_haves)
- Human-readable: required Markdown sections (`## Objective`, `## Tasks`, `## Verification`, ...)
- Tasks: each task is a `### Task N:` block with required `**Type:**`, `**Action:**`, `**Verify:**`, and `**Done When:**` fields (plus checkpoint-specific fields)

Canonical template: `get-shit-done/templates/phase-prompt.md`

---

## Commit Policy

- `.planning/` artifacts are never committed.
- Code commits happen only if you explicitly request commits in the current session.
- “Atomic commits” are optional and applied per task only when requested.

---

## OpenCode-Native Changes

- Removed Claude-specific paths and assumptions; hooks now read `.planning/STATE.md`.
- Models are set on agent definitions, not per-call config.
- Checkpoint/verification examples live in reference docs rather than inline blocks.

---

## What Changed From Upstream GSD

- OpenCode-first: removed Claude coupling (no `~/.claude` paths; statusline reads `.planning/STATE.md`).
- Planning collaboration: mandatory human review in interactive mode with natural-language feedback loops.
- New review artifacts: `.planning/PROJECT-REVIEW.md` and `.planning/phases/XX-name/XX-REVIEW.md`.
- `/gsd-new-project`, `/gsd-discuss-phase`, and `/gsd-plan-phase` now require freeform review/approval in interactive mode.
- Question tool is now optional and used only for discrete decisions; default is conversational prompts.
- Commit policy tightened: `.planning/` artifacts are never committed; code commits only when explicitly requested.
- “Atomic commits” are optional and applied per task only when requested; quick mode reflects this.
- Model selection moved to agent headers; `.planning/config.json` no longer contains model mapping.
- Core rules updated for GPT‑5.2/Codex: no upfront plans, scope discipline, parallel reads.
- Docs/templates consolidated: canonical codebase templates used; large inline examples moved to references.
- Removed outdated docs (`planning-config.md`, `ui-brand.md`) and replaced with canonical references.
- Plan format updated: `*-PLAN.md` files now use Markdown sections and task blocks (no XML task tags).

---

## Troubleshooting

Commands not found?

- Restart OpenCode
- Verify files exist under `~/.config/opencode/command/` (e.g. `gsd-help.md`)

---

## License

MIT License. See [LICENSE](LICENSE) for details.
