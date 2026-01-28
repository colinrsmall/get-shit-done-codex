<div align="center">

# GET SHIT DONE

**A lightweight meta-prompting, context engineering, and spec-driven development system for OpenCode.**

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/5JJgD5svVS)
[![GitHub stars](https://img.shields.io/github/stars/glittercowboy/get-shit-done?style=for-the-badge&logo=github&color=181717)](https://github.com/glittercowboy/get-shit-done)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## Install (Manual)

Copy these folders into your OpenCode config directory:

- `commands/` → `~/.config/opencode/commands/`
- `agents/` → `~/.config/opencode/agents/`
- `get-shit-done/` → `~/.config/opencode/get-shit-done/`

Example:

```bash
mkdir -p ~/.config/opencode
cp -R commands agents get-shit-done ~/.config/opencode/
```

Restart OpenCode, then run:

```
/gsd-help
```

---

## Quick Start

1. `/gsd-new-project` - Initialize project (questions -> research -> requirements -> roadmap)
2. `/gsd-plan-phase 1` - Create detailed plans for Phase 1
3. `/gsd-execute-phase 1` - Execute Phase 1

---

## Commands

Run `/gsd-help` for the complete command reference.

---

## Configuration

GSD stores project settings in `.planning/config.json`.

- Use `/gsd-settings` to toggle workflow agents (researcher, plan checker, verifier).
- Edit `.planning/config.json` `models` to change which model each agent uses.

---

## Troubleshooting

Commands not found?

- Restart OpenCode
- Verify files exist under `~/.config/opencode/commands/` (e.g. `gsd-help.md`)

---

## License

MIT License. See [LICENSE](LICENSE) for details.
