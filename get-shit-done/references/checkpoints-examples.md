# Checkpoints Examples

Extra examples and extended automation references for `get-shit-done/references/checkpoints.md`.

<checkpoints_examples>

## Human-Verify Examples

**Example: UI Component**
```markdown
### Task 1: Build responsive dashboard layout

**Type:** `auto`
**Files:** `src/components/Dashboard.tsx`, `src/app/dashboard/page.tsx`
**Action:**
- Create dashboard with sidebar, header, and content area.
- Use Tailwind responsive classes for mobile.
**Verify:**
- `npm run build` succeeds (no TypeScript errors)
**Done When:**
- Dashboard builds and renders without errors

### Task 2: Start dev server for verification

**Type:** `auto`
**Files:** (none)
**Action:**
- Run `npm run dev` in background and wait for ready.
**Verify:**
- `curl http://localhost:3000` returns 200
**Done When:**
- Dev server running at http://localhost:3000

### Task 3: Human verification - dashboard layout

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** Responsive dashboard layout - dev server running at http://localhost:3000
**How To Verify:**
1. Visit http://localhost:3000/dashboard
2. Desktop (>1024px): sidebar left, content right, header top
3. Tablet (768px): sidebar collapses to hamburger menu
4. Mobile (375px): single column layout, bottom nav appears
5. No layout shift or horizontal scroll at any size
**Resume Signal:** Reply with `approved` or describe layout issues.
```

**Example: Xcode Build**
```markdown
### Task 1: Build macOS app with Xcode

**Type:** `auto`
**Files:** `App.xcodeproj`, `Sources/`
**Action:**
- Run `xcodebuild -project App.xcodeproj -scheme App build`.
- Check output for compilation errors.
**Verify:**
- Build output contains `BUILD SUCCEEDED` and no errors
**Done When:**
- App builds successfully

### Task 2: Human verification - run app

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** Built macOS app at `DerivedData/Build/Products/Debug/App.app`
**How To Verify:**
1. Open `App.app`
2. App launches without crashes
3. Menu bar icon appears
4. Preferences window opens correctly
5. No visual glitches or layout issues
**Resume Signal:** Reply with `approved` or describe issues.
```

## Decision Examples

**Example: Auth Provider Selection**
```markdown
### Task N: Decision - authentication provider

**Type:** `checkpoint:decision`
**Gate:** `blocking`
**Decision Needed:** Select authentication provider
**Context:** Need user authentication for the app. Three solid options with different tradeoffs.
**Options:**
- `supabase`: Pros: built-in with Supabase DB, generous free tier, row-level security integration. Cons: less customizable UI, tied to Supabase ecosystem.
- `clerk`: Pros: beautiful pre-built UI, great DX, excellent docs. Cons: paid after 10k MAU, vendor lock-in.
- `nextauth`: Pros: free, self-hosted, maximum control, widely adopted. Cons: more setup work, you manage security updates, UI is DIY.
**Resume Signal:** Select `supabase`, `clerk`, or `nextauth`.
```

**Example: Database Selection**
```markdown
### Task N: Decision - database selection

**Type:** `checkpoint:decision`
**Gate:** `blocking`
**Decision Needed:** Select database for user data
**Context:** App needs persistent storage for users, sessions, and user-generated content. Expected scale: 10k users, 1M records first year.
**Options:**
- `supabase`: Pros: full SQL, generous free tier, built-in auth, real-time subscriptions. Cons: lock-in for realtime features, less flexible than raw Postgres.
- `planetscale`: Pros: serverless scaling, branching workflow, good DX. Cons: MySQL not Postgres, no foreign keys in free tier.
- `convex`: Pros: real-time by default, TypeScript-native, automatic caching. Cons: newer platform, different mental model, less SQL flexibility.
**Resume Signal:** Select `supabase`, `planetscale`, or `convex`.
```

## Human-Action Examples

**Example: Email Verification**
```markdown
### Task 1: Create SendGrid account via API

**Type:** `auto`
**Files:** (none)
**Action:**
- Use SendGrid API to create subuser account with provided email.
- Request verification email.
**Verify:**
- API returns 201 and account is created
**Done When:**
- Account created and verification email sent

### Task 2: Human action - verify SendGrid email

**Type:** `checkpoint:human-action`
**Gate:** `blocking`
**Automation Attempted:**
- Created the account and requested a verification email.
**Action Needed:** Click the SendGrid verification link in your inbox.
**Why:** Email verification requires human interaction.
**Verification (After):**
- SendGrid API key works (curl test succeeds)
**Resume Signal:** Reply with `done` when email is verified.
```

**Example: Credit Card 3D Secure**
```markdown
### Task 1: Create Stripe payment intent

**Type:** `auto`
**Files:** (none)
**Action:**
- Use Stripe API to create payment intent for $99.
- Generate checkout URL.
**Verify:**
- Stripe API returns payment intent ID and URL
**Done When:**
- Payment intent created

### Task 2: Human action - complete 3D Secure

**Type:** `checkpoint:human-action`
**Gate:** `blocking`
**Automation Attempted:**
- Created the payment intent and generated a checkout URL.
**Action Needed:** Visit `https://checkout.stripe.com/pay/cs_test_abc123` and complete the 3D Secure verification flow.
**Why:** 3D Secure requires human interaction.
**Verification (After):**
- Stripe webhook receives `payment_intent.succeeded` event
**Resume Signal:** Reply with `done` when payment completes.
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
```markdown
<!-- WRONG: Asking user to add env vars in dashboard -->

### Task N: Human action - set env var in dashboard

**Type:** `checkpoint:human-action`
**Gate:** `blocking`
**Automation Attempted:**
- None
**Action Needed:** Add `OPENAI_API_KEY` to the Convex dashboard
**Why:** This is automatable via CLI; the assistant should do it.

<!-- RIGHT: Assistant asks for value, then adds via CLI -->

### Task N: Human action - provide OpenAI API key

**Type:** `checkpoint:human-action`
**Gate:** `blocking`
**Automation Attempted:**
- Ready to configure Convex env vars via CLI
**Action Needed:** Paste your OpenAI API key (starts with `sk-`)
**Why:** Secret retrieval requires user access to their account
**Verification (After):**
- I'll add it via `npx convex env set` and verify it's configured
**Resume Signal:** Paste your API key.

### Task N: Configure OpenAI key in Convex

**Type:** `auto`
**Files:** (none)
**Action:**
- Run `npx convex env set OPENAI_API_KEY {user-provided-key}`
**Verify:**
- `npx convex env get OPENAI_API_KEY` returns the key (masked)
**Done When:**
- Convex env var is set and readable
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
```markdown
<!-- Assistant starts server before checkpoint -->

### Task N: Start dev server

**Type:** `auto`
**Files:** (none)
**Action:**
- Run `npm run dev` in background and wait for ready signal
**Verify:**
- `curl http://localhost:3000` returns 200
**Done When:**
- Dev server is running

<!-- User only visits URL -->

### Task N: Human verification - Feature X

**Type:** `checkpoint:human-verify`
**Gate:** `blocking`
**What Built:** Feature X - dev server running at http://localhost:3000
**How To Verify:**
1. Visit http://localhost:3000/feature
2. [Visual check 1]
3. [Visual check 2]
**Resume Signal:** Reply with `approved` or describe issues.
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
