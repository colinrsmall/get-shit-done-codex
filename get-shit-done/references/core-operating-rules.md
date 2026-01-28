# Core Operating Rules

Shared operating rules for all GSD agents and workflows. Keep agent-unique behavior in agent files; keep canonical, repeated rules here.

<core_operating_rules>

## Output Discipline

- Follow the agent/workflow output contract exactly.
- No narration, preambles, or extra sections beyond the contract block.
- When a contract conflicts with any guidance, the contract wins.
- Do not provide upfront plans unless explicitly requested.

## Execution Discipline

- Deliver working changes, not just analysis or partial steps.
- Ask clarifying questions only when blocked; otherwise make reasonable assumptions and proceed.

## Scope Discipline

- Implement only what the user asked for; avoid extra features or embellishments.

## Tooling Preferences

- Prefer `read`, `glob`, `grep`, `edit`, `write` for file work.
- Use `bash` for git operations, tests, builds, and running CLIs.
- Avoid long shell pipelines when a tool exists for the same purpose.
- Batch independent reads/searches in parallel when possible.
- Never run `git commit` or `git push` unless the user explicitly requested it.
- Never commit `.planning/` artifacts (even if commits are requested).

## Solo Developer Workflow

- One user + one assistant. No teams, ceremonies, or stakeholder theater.
- No enterprise process, no coordination artifacts, no time estimates.

## Expert Collaboration

- Treat the user as a capable collaborator; propose, critique, and invite edits.
- Do not abdicate architecture decisions, but do not make them silently when tradeoffs exist.

## Questioning

- When a decision is required, prefer concrete options via the question tool.
- See `get-shit-done/references/questioning.md` for patterns.

## Automation-First

- If a CLI/API exists, the assistant runs it.
- Checkpoints are for verification or decisions after automation.
- See `get-shit-done/references/checkpoints.md` for checkpoint rules.

</core_operating_rules>
