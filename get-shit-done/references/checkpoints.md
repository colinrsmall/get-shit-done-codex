<overview>
Plans execute autonomously. Checkpoints formalize interaction points where human verification or decisions are needed.

**Core principle:** The assistant automates everything with CLI/API. Checkpoints are for verification and decisions, not manual work.

**Golden rules:**
1. **If the assistant can run it, the assistant runs it** - Never ask the user to execute CLI commands, start servers, or run builds
2. **The assistant sets up the verification environment** - Start dev servers, seed databases, configure env vars
3. **User only does what requires human judgment** - Visual checks, UX evaluation, "does this feel right?"
4. **Secrets come from user, automation comes from the assistant** - Ask for API keys, then the assistant uses them via CLI
</overview>

<checkpoint_types>

<type name="human-verify">
## checkpoint:human-verify (Most Common - 90%)

**When:** The assistant completed automated work, human confirms it works correctly.

**Use for:**
- Visual UI checks (layout, styling, responsiveness)
- Interactive flows (click through wizard, test user flows)
- Functional verification (feature works as expected)
- Audio/video playback quality
- Animation smoothness
- Accessibility testing

**Structure:**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[What the assistant automated and deployed/built]</what-built>
  <how-to-verify>
    [Exact steps to test - URLs, commands, expected behavior]
  </how-to-verify>
  <resume-signal>[How to continue - "approved", "yes", or describe issues]</resume-signal>
</task>
```

**Key elements:**
- `<what-built>`: What the assistant automated (deployed, built, configured)
- `<how-to-verify>`: Exact steps to confirm it works (numbered, specific)
- `<resume-signal>`: Clear indication of how to continue

**Example (short):**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Feature X running at http://localhost:3000</what-built>
  <how-to-verify>
    Visit http://localhost:3000/feature and confirm expected behavior.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

**More examples:** See `get-shit-done/references/checkpoints-examples.md`.
</type>

<type name="decision">
## checkpoint:decision (9%)

**When:** Human must make choice that affects implementation direction.

**Use for:**
- Technology selection (which auth provider, which database)
- Architecture decisions (monorepo vs separate repos)
- Design choices (color scheme, layout approach)
- Feature prioritization (which variant to build)
- Data model decisions (schema structure)

**Structure:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>[What's being decided]</decision>
  <context>[Why this decision matters]</context>
  <options>
    <option id="option-a">
      <name>[Option name]</name>
      <pros>[Benefits]</pros>
      <cons>[Tradeoffs]</cons>
    </option>
    <option id="option-b">
      <name>[Option name]</name>
      <pros>[Benefits]</pros>
      <cons>[Tradeoffs]</cons>
    </option>
  </options>
  <resume-signal>[How to indicate choice]</resume-signal>
</task>
```

**Key elements:**
- `<decision>`: What's being decided
- `<context>`: Why this matters
- `<options>`: Each option with balanced pros/cons (not prescriptive)
- `<resume-signal>`: How to indicate choice

**Examples:** See `get-shit-done/references/checkpoints-examples.md`.
</type>

<type name="human-action">
## checkpoint:human-action (1% - Rare)

**When:** Action has no CLI/API and requires human-only interaction, OR the assistant hit an authentication gate during automation.

**Use ONLY for:**
- Authentication gates (assistant tried CLI/API but needs credentials)
- Email verification links
- SMS 2FA codes
- Manual account approvals
- Credit card 3D Secure flows
- OAuth app approvals

**Do NOT use for pre-planned manual work:**
- Manually creating Stripe webhooks (use API, auth gate if needed)
- Manually creating databases (use provider CLI)
- Running builds/tests manually (use Bash tool)
- Creating files manually (use Write tool)

**Structure:**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>[What human must do - the assistant already did everything automatable]</action>
  <instructions>
    [What the assistant already automated]
    [The ONE thing requiring human action]
  </instructions>
  <verification>[What the assistant can check afterward]</verification>
  <resume-signal>[How to continue]</resume-signal>
</task>
```

**Key principle:** The assistant automates everything possible first, only asks human for the truly unavoidable manual step.

**Examples:** See `get-shit-done/references/checkpoints-examples.md`.
</type>
</checkpoint_types>

<execution_protocol>

When the assistant encounters `type="checkpoint:*"`:

1. **Stop immediately** - do not proceed to next task
2. **Display checkpoint clearly** using the defined checkpoint format
3. **Wait for user response** - do not hallucinate completion
4. **Verify if possible** - check files, run tests, whatever is specified
5. **Resume execution** - continue to next task only after confirmation

**Examples:** See `get-shit-done/references/checkpoints-examples.md`.
</execution_protocol>

<authentication_gates>

**Critical:** When the assistant tries CLI/API and gets an auth error, this is not a failure. It is a gate requiring human input to unblock automation.

**Pattern:** Assistant tries automation → auth error → creates checkpoint → user authenticates → assistant retries → continues.

**Gate protocol:**
1. Recognize it's not a failure - missing auth is expected
2. Stop current task - don't retry repeatedly
3. Create checkpoint:human-action dynamically
4. Provide exact authentication steps
5. Verify authentication works
6. Retry the original task
7. Continue normally

**Key distinction:**
- Pre-planned checkpoint: "I need you to do X" (wrong - the assistant should automate)
- Auth gate: "I tried to automate X but need credentials" (correct - unblocks automation)

**Examples:** See `get-shit-done/references/checkpoints-examples.md`.
</authentication_gates>

<automation_reference>

**The rule:** If it has CLI/API, the assistant does it. Never ask humans to perform automatable work.

**Core automation principles:**
- Assistant sets up verification environment before checkpoints
- Env vars are set via CLI (ask for values only)
- Dev servers are started by the assistant; users only visit URLs
- Auto-install CLIs where safe; checkpoint if user choice is required
- Fix broken verification environments before presenting checkpoints

**Details and tables:** See `get-shit-done/references/checkpoints-examples.md`.
</automation_reference>

<writing_guidelines>

**DO:**
- Automate everything with CLI/API before checkpoint
- Be specific (URLs, steps, expected outcomes)
- Make verification executable and unambiguous

**DON'T:**
- Ask human to do work the assistant can automate
- Mix multiple verifications in one checkpoint
- Present a checkpoint with a broken verification environment

**More guidance:** See `get-shit-done/references/checkpoints-examples.md`.
</writing_guidelines>

<summary>

Checkpoints formalize human-in-the-loop points. Use them when the assistant cannot complete a task autonomously or when human verification is required for correctness.

**The golden rule:** If the assistant can automate it, the assistant must automate it.

**Checkpoint priority:**
1. **checkpoint:human-verify** (90%) - Assistant automated everything, human confirms correctness
2. **checkpoint:decision** (9%) - Human makes architecture/technology choices
3. **checkpoint:human-action** (1%) - Truly unavoidable manual steps with no API/CLI

**When NOT to use checkpoints:**
- Things the assistant can verify programmatically (tests pass, build succeeds)
- File operations (the assistant can read files to verify)
- Code correctness (use tests and static analysis)
- Anything automatable via CLI/API
</summary>
