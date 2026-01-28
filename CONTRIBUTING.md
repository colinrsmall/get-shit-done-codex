# Contributing

No enterprise theater. Ship useful improvements.

## What This Repo Is

GSD is a set of OpenCode resources:

- Slash commands: `commands/gsd-*.md`
- Subagent roles: `agents/gsd-*.md`
- Shared workflows/templates/references: `get-shit-done/`

There is no installer and no npm publish flow. Users copy these folders into `~/.config/opencode/`.

## Contribution Guidelines

- Keep commands OpenCode-native (flat filenames, no transforms).
- Use frontmatter:
  - `description`, optional `argument-hint`
  - `tools:` boolean map (use `question`, not `AskUserQuestion`)
- Avoid absolute paths; prefer `~/.config/opencode/...` for installed resources.
- If you reference another command in text, use the real slash name (e.g. `/gsd-plan-phase`, not the legacy colon form).
- Prefer `subagent_type="gsd-*"` over generic agents unless there's a strong reason.

## When You Change User-Facing Behavior

- Update `commands/gsd-help.md` if commands/usage changed.
- Update `README.md` if install steps or quick start changed.
