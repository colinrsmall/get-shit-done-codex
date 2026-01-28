# Models

GSD uses OpenCode agent configuration for model selection. Task calls do not accept per-call model overrides.

## Where models are set

- OpenCode agent config (e.g., `opencode.json` or agent frontmatter) defines each agent's model.
- Subagents inherit the invoking agent's model if they don't define one explicitly.

## Notes

- Models are defined in agent frontmatter (e.g., `agents/gsd-executor.md`).
- Update agent definitions to change models; Task calls do not accept per-call model overrides.
- Convention: coding agents use `openai/gpt-5.2-codex`, non-coding agents use `openai/gpt-5.2`.
