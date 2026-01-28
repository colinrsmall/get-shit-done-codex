# Models

GSD does not use profiles. Each orchestrator reads explicit model IDs from `.planning/config.json` and passes them into `Task(..., model="...")` when spawning subagents.

## Config

Set per-agent models in `.planning/config.json`:

```json
{
  "models": {
    "gsd-planner": "openai/gpt-5.2-high",
    "gsd-roadmapper": "openai/gpt-5.2-high",
    "gsd-phase-researcher": "openai/gpt-5.2-high",
    "gsd-project-researcher": "openai/gpt-5.2-high",
    "gsd-research-synthesizer": "openai/gpt-5.2-high",
    "gsd-plan-checker": "openai/gpt-5.2-high",
    "gsd-verifier": "openai/gpt-5.2-high",
    "gsd-integration-checker": "openai/gpt-5.2-high",
    "gsd-codebase-mapper": "openai/gpt-5.2-high",
    "gsd-executor": "openai/gpt-5.2-codex-high",
    "gsd-debugger": "openai/gpt-5.2-codex-high"
  }
}
```

## Resolution Logic

Orchestrators resolve the specific agent model(s) they need:

```
1. Read .planning/config.json
2. Get models[<subagent_type>] (fall back to a default model ID if missing)
3. Pass model parameter to Task call
```
