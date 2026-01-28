---
description: Configure GSD workflow toggles
tools:
  read: true
  write: true
  bash: true
  question: true
---

<objective>
Allow users to toggle workflow agents on/off via interactive settings.

Updates `.planning/config.json` with workflow preferences.
</objective>

<process>

## 1. Validate Environment

```bash
ls .planning/config.json 2>/dev/null
```

**If not found:** Error - run `/gsd-new-project` first.

## 2. Read Current Config

```bash
cat .planning/config.json
```

Parse current values (default to `true` if not present):
- `workflow.research` — spawn researcher during plan-phase
- `workflow.plan_check` — spawn plan checker during plan-phase
- `workflow.verifier` — spawn verifier during execute-phase

## 3. Present Settings

Use question with these 3 questions (single-select each):

- header: "Research"
  question: "Spawn Plan Researcher? (researches domain before planning)"
  options:
    - "Yes" — Research phase goals before planning
    - "No" — Skip research, plan directly

- header: "Plan Check"
  question: "Spawn Plan Checker? (verifies plans before execution)"
  options:
    - "Yes" — Verify plans meet phase goals
    - "No" — Skip plan verification

- header: "Verifier"
  question: "Spawn Execution Verifier? (verifies phase completion)"
  options:
    - "Yes" — Verify must-haves after execution
    - "No" — Skip post-execution verification

## 4. Update Config

Merge new settings into existing config.json:

```json
{
  ...existing_config,
  "workflow": {
    "research": true/false,
    "plan_check": true/false,
    "verifier": true/false
  }
}
```

Write updated config to `.planning/config.json`.

## 5. Confirm Changes

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► SETTINGS UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Setting              | Value |
|----------------------|-------|
| Plan Researcher      | {On/Off} |
| Plan Checker         | {On/Off} |
| Execution Verifier   | {On/Off} |

These settings apply to future /gsd-plan-phase and /gsd-execute-phase runs.

Quick commands:
- /gsd-plan-phase --research — force research
- /gsd-plan-phase --skip-research — skip research
- /gsd-plan-phase --skip-verify — skip plan check

To change which models agents use, edit `.planning/config.json` `models`.
```

</process>

<success_criteria>
- [ ] Current config read
- [ ] User presented with 3 settings (workflow toggles)
- [ ] Config updated with workflow section
- [ ] Changes confirmed to user
</success_criteria>
