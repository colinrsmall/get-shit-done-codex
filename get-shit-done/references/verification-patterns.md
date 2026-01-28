# Verification Patterns

How to verify artifacts are real implementations, not placeholders.

<core_principle>
**Existence ≠ Implementation**

Verification checks four levels:
1. **Exists** - File is present at expected path
2. **Substantive** - Content is real implementation, not placeholder
3. **Wired** - Connected to the rest of the system
4. **Functional** - Actually works when invoked (often human-verified)
</core_principle>

<stub_detection>
## Universal Stub Patterns

Look for placeholder indicators:
- TODO/FIXME/XXX/HACK comments
- "coming soon", "placeholder", "lorem ipsum"
- Empty handlers or trivial returns (`return null`, `return {}`, `return []`)
- Hardcoded values where dynamic behavior is expected

Use these as red flags before deeper wiring checks.
</stub_detection>

<artifact_checks>
## Artifact Checks (Short)

**React/Next.js component (example):**
- **Exists:** file present and exports a component
- **Substantive:** returns meaningful JSX, not a placeholder div
- **Wired:** imported/used by a route or parent component

**API route (example):**
- **Exists:** route file present with HTTP method handlers
- **Substantive:** includes data access or business logic
- **Wired:** called by UI/client or referenced in app

**More patterns and commands:**
See `get-shit-done/references/verification-patterns-examples.md`.
</artifact_checks>

<human_verification_triggers>
## When to Require Human Verification

Some behavior cannot be verified programmatically. Require human checks for:
- Visual appearance, interaction flow, UX feel
- Real-time behavior (WebSocket, SSE)
- External service integrations (payments, email)
- Accessibility and responsiveness

See `get-shit-done/references/checkpoints.md` for checkpoint patterns.
</human_verification_triggers>

<checkpoint_automation_reference>
## Pre-Checkpoint Automation

For automation-first checkpoint patterns, server lifecycle management, CLI installation handling, and error recovery protocols, see:

**`get-shit-done/references/checkpoints.md`** and `get-shit-done/references/checkpoints-examples.md`.

</checkpoint_automation_reference>
