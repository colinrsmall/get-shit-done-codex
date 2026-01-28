# Checkpoints Examples

Extra examples and extended automation references for `get-shit-done/references/checkpoints.md`.

<checkpoints_examples>

## Human-Verify Examples

**Example: UI Component**
```xml
<task type="auto">
  <name>Build responsive dashboard layout</name>
  <files>src/components/Dashboard.tsx, src/app/dashboard/page.tsx</files>
  <action>Create dashboard with sidebar, header, and content area. Use Tailwind responsive classes for mobile.</action>
  <verify>npm run build succeeds, no TypeScript errors</verify>
  <done>Dashboard component builds without errors</done>
</task>

<task type="auto">
  <name>Start dev server for verification</name>
  <action>Run `npm run dev` in background, wait for "ready" message, capture port</action>
  <verify>curl http://localhost:3000 returns 200</verify>
  <done>Dev server running at http://localhost:3000</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Responsive dashboard layout - dev server running at http://localhost:3000</what-built>
  <how-to-verify>
    Visit http://localhost:3000/dashboard and verify:
    1. Desktop (>1024px): Sidebar left, content right, header top
    2. Tablet (768px): Sidebar collapses to hamburger menu
    3. Mobile (375px): Single column layout, bottom nav appears
    4. No layout shift or horizontal scroll at any size
  </how-to-verify>
  <resume-signal>Type "approved" or describe layout issues</resume-signal>
</task>
```

**Example: Xcode Build**
```xml
<task type="auto">
  <name>Build macOS app with Xcode</name>
  <files>App.xcodeproj, Sources/</files>
  <action>Run `xcodebuild -project App.xcodeproj -scheme App build`. Check for compilation errors in output.</action>
  <verify>Build output contains "BUILD SUCCEEDED", no errors</verify>
  <done>App builds successfully</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Built macOS app at DerivedData/Build/Products/Debug/App.app</what-built>
  <how-to-verify>
    Open App.app and test:
    - App launches without crashes
    - Menu bar icon appears
    - Preferences window opens correctly
    - No visual glitches or layout issues
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

## Decision Examples

**Example: Auth Provider Selection**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>Select authentication provider</decision>
  <context>
    Need user authentication for the app. Three solid options with different tradeoffs.
  </context>
  <options>
    <option id="supabase">
      <name>Supabase Auth</name>
      <pros>Built-in with Supabase DB we're using, generous free tier, row-level security integration</pros>
      <cons>Less customizable UI, tied to Supabase ecosystem</cons>
    </option>
    <option id="clerk">
      <name>Clerk</name>
      <pros>Beautiful pre-built UI, best developer experience, excellent docs</pros>
      <cons>Paid after 10k MAU, vendor lock-in</cons>
    </option>
    <option id="nextauth">
      <name>NextAuth.js</name>
      <pros>Free, self-hosted, maximum control, widely adopted</pros>
      <cons>More setup work, you manage security updates, UI is DIY</cons>
    </option>
  </options>
  <resume-signal>Select: supabase, clerk, or nextauth</resume-signal>
</task>
```

**Example: Database Selection**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>Select database for user data</decision>
  <context>
    App needs persistent storage for users, sessions, and user-generated content.
    Expected scale: 10k users, 1M records first year.
  </context>
  <options>
    <option id="supabase">
      <name>Supabase (Postgres)</name>
      <pros>Full SQL, generous free tier, built-in auth, real-time subscriptions</pros>
      <cons>Vendor lock-in for real-time features, less flexible than raw Postgres</cons>
    </option>
    <option id="planetscale">
      <name>PlanetScale (MySQL)</name>
      <pros>Serverless scaling, branching workflow, excellent DX</pros>
      <cons>MySQL not Postgres, no foreign keys in free tier</cons>
    </option>
    <option id="convex">
      <name>Convex</name>
      <pros>Real-time by default, TypeScript-native, automatic caching</pros>
      <cons>Newer platform, different mental model, less SQL flexibility</cons>
    </option>
  </options>
  <resume-signal>Select: supabase, planetscale, or convex</resume-signal>
</task>
```

## Human-Action Examples

**Example: Email Verification**
```xml
<task type="auto">
  <name>Create SendGrid account via API</name>
  <action>Use SendGrid API to create subuser account with provided email. Request verification email.</action>
  <verify>API returns 201, account created</verify>
  <done>Account created, verification email sent</done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <action>Complete email verification for SendGrid account</action>
  <instructions>
    I created the account and requested verification email.
    Check your inbox for SendGrid verification link and click it.
  </instructions>
  <verification>SendGrid API key works: curl test succeeds</verification>
  <resume-signal>Type "done" when email verified</resume-signal>
</task>
```

**Example: Credit Card 3D Secure**
```xml
<task type="auto">
  <name>Create Stripe payment intent</name>
  <action>Use Stripe API to create payment intent for $99. Generate checkout URL.</action>
  <verify>Stripe API returns payment intent ID and URL</verify>
  <done>Payment intent created</done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <action>Complete 3D Secure authentication</action>
  <instructions>
    I created the payment intent: https://checkout.stripe.com/pay/cs_test_abc123
    Visit that URL and complete the 3D Secure verification flow with your test card.
  </instructions>
  <verification>Stripe webhook receives payment_intent.succeeded event</verification>
  <resume-signal>Type "done" when payment completes</resume-signal>
</task>
```

## Execution Protocol Examples

**For checkpoint:human-verify:**
```
╔═══════════════════════════════════════════════════════╗
║  CHECKPOINT: Verification Required                    ║
╚═══════════════════════════════════════════════════════╝

Progress: 5/8 tasks complete
Task: Responsive dashboard layout

Built: Responsive dashboard at /dashboard

How to verify:
  1. Visit: http://localhost:3000/dashboard
  2. Desktop (>1024px): Sidebar visible, content fills remaining space
  3. Tablet (768px): Sidebar collapses to icons
  4. Mobile (375px): Sidebar hidden, hamburger menu appears

────────────────────────────────────────────────────────
→ YOUR ACTION: Type "approved" or describe issues
────────────────────────────────────────────────────────
```

**For checkpoint:decision:**
```
╔═══════════════════════════════════════════════════════╗
║  CHECKPOINT: Decision Required                        ║
╚═══════════════════════════════════════════════════════╝

Progress: 2/6 tasks complete
Task: Select authentication provider

Decision: Which auth provider should we use?

Context: Need user authentication. Three options with different tradeoffs.

Options:
  1. supabase - Built-in with our DB, free tier
     Pros: Row-level security integration, generous free tier
     Cons: Less customizable UI, ecosystem lock-in

  2. clerk - Best DX, paid after 10k users
     Pros: Beautiful pre-built UI, excellent documentation
     Cons: Vendor lock-in, pricing at scale

  3. nextauth - Self-hosted, maximum control
     Pros: Free, no vendor lock-in, widely adopted
     Cons: More setup work, DIY security updates

────────────────────────────────────────────────────────
→ YOUR ACTION: Select supabase, clerk, or nextauth
────────────────────────────────────────────────────────
```

## Automation Reference (Extended)

### Service CLI Reference

| Service | CLI/API | Key Commands | Auth Gate |
|---------|---------|--------------|-----------|
| Railway | `railway` | `init`, `up`, `variables set` | `railway login` |
| Fly | `fly` | `launch`, `deploy`, `secrets set` | `fly auth login` |
| Stripe | `stripe` + API | `listen`, `trigger`, API calls | API key in .env |
| Supabase | `supabase` | `init`, `link`, `db push`, `gen types` | `supabase login` |
| Upstash | `upstash` | `redis create`, `redis get` | `upstash auth login` |
| PlanetScale | `pscale` | `database create`, `branch create` | `pscale auth login` |
| GitHub | `gh` | `repo create`, `pr create`, `secret set` | `gh auth login` |
| Node | `npm`/`pnpm` | `install`, `run build`, `test`, `run dev` | N/A |
| Xcode | `xcodebuild` | `-project`, `-scheme`, `build`, `test` | N/A |
| Convex | `npx convex` | `dev`, `deploy`, `env set`, `env get` | `npx convex login` |

### Environment Variable Automation

**Env files:** Use Write/Edit tools. Never ask human to create .env manually.

**Dashboard env vars via CLI:**

| Platform | CLI Command | Example |
|----------|-------------|---------|
| Convex | `npx convex env set` | `npx convex env set OPENAI_API_KEY sk-...` |
| Railway | `railway variables set` | `railway variables set API_KEY=value` |
| Fly | `fly secrets set` | `fly secrets set DATABASE_URL=...` |
| Supabase | `supabase secrets set` | `supabase secrets set MY_SECRET=value` |

**Pattern for secret collection:**
```xml
<!-- WRONG: Asking user to add env vars in dashboard -->
<task type="checkpoint:human-action">
  <action>Add OPENAI_API_KEY to Convex dashboard</action>
  <instructions>Go to dashboard.convex.dev → Settings → Environment Variables → Add</instructions>
</task>

<!-- RIGHT: Assistant asks for value, then adds via CLI -->
<task type="checkpoint:human-action">
  <action>Provide your OpenAI API key</action>
  <instructions>
    I need your OpenAI API key to configure the Convex backend.
    Get it from: https://platform.openai.com/api-keys
    Paste the key (starts with sk-)
  </instructions>
  <verification>I'll add it via `npx convex env set` and verify it's configured</verification>
  <resume-signal>Paste your API key</resume-signal>
</task>

<task type="auto">
  <name>Configure OpenAI key in Convex</name>
  <action>Run `npx convex env set OPENAI_API_KEY {user-provided-key}`</action>
  <verify>`npx convex env get OPENAI_API_KEY` returns the key (masked)</verify>
</task>
```

### Dev Server Automation

**Assistant starts servers, user visits URLs:**

| Framework | Start Command | Ready Signal | Default URL |
|-----------|---------------|--------------|-------------|
| Next.js | `npm run dev` | "Ready in" or "started server" | http://localhost:3000 |
| Vite | `npm run dev` | "ready in" | http://localhost:5173 |
| Convex | `npx convex dev` | "Convex functions ready" | N/A (backend only) |
| Express | `npm start` | "listening on port" | http://localhost:3000 |
| Django | `python manage.py runserver` | "Starting development server" | http://localhost:8000 |

**Server lifecycle protocol:**
```bash
# Run in background, capture PID for cleanup
npm run dev &
DEV_SERVER_PID=$!

# Wait for ready signal (max 30s)
timeout 30 bash -c 'until curl -s localhost:3000 > /dev/null 2>&1; do sleep 1; done'
```

**Port conflicts:**
If default port is in use, check what's running and either:
1. Kill the existing process if it's stale: `lsof -ti:3000 | xargs kill`
2. Use alternate port: `npm run dev -- --port 3001`

**Pattern:**
```xml
<!-- Assistant starts server before checkpoint -->
<task type="auto">
  <name>Start dev server</name>
  <action>Run `npm run dev` in background, wait for ready signal</action>
  <verify>curl http://localhost:3000 returns 200</verify>
  <done>Dev server running</done>
</task>

<!-- User only visits URL -->
<task type="checkpoint:human-verify">
  <what-built>Feature X - dev server running at http://localhost:3000</what-built>
  <how-to-verify>
    Visit http://localhost:3000/feature and verify:
    1. [Visual check 1]
    2. [Visual check 2]
  </how-to-verify>
</task>
```

### CLI Installation Handling

**When a required CLI is not installed:**

| CLI | Auto-install? | Command |
|-----|---------------|---------|
| npm/pnpm/yarn | No - ask user | User chooses package manager |
| gh (GitHub) | Yes | `brew install gh` (macOS) or `apt install gh` (Linux) |
| stripe | Yes | `npm i -g stripe` |
| supabase | Yes | `npm i -g supabase` |
| convex | No - use npx | `npx convex` (no install needed) |
| fly | Yes | `brew install flyctl` or curl installer |
| railway | Yes | `npm i -g @railway/cli` |

**Protocol:**
1. Try the command
2. If "command not found", check if auto-installable
3. If yes: install silently, retry command
4. If no: create checkpoint asking user to install

### Pre-Checkpoint Automation Failures

**When setup fails before checkpoint:**

| Failure | Response |
|---------|----------|
| Server won't start | Check error output, fix issue, retry (don't proceed to checkpoint) |
| Port in use | Kill stale process or use alternate port |
| Missing dependency | Run `npm install`, retry |
| Build error | Fix the error first (this is a bug, not a checkpoint issue) |
| Auth error | Create auth gate checkpoint |
| Network timeout | Retry with backoff, then checkpoint if persistent |

**Key principle:** Never present a checkpoint with broken verification environment. If `curl localhost:3000` fails, don't ask user to "visit localhost:3000".

</checkpoints_examples>
