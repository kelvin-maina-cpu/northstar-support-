# Northstar Support — React + Vite Port

## ⚠️ If you're seeing a blank white page
**You almost certainly double-clicked `index.html` and opened it directly in a browser (a `file://` URL).** This project *cannot* run that way — Vite's build uses ES module scripts with absolute paths (`/assets/...`) that only resolve when a real server is serving the files. Opening the file directly gives you a silent, blank page with nothing useful in the console.

**Fix:** run an actual server. From this folder:
```
npm install
npm run dev
```
Then open the URL it prints (**http://localhost:5173**) — don't open any `.html` file directly, ever, for this project.

Verified before this was written: `npm install`, `npm run build`, and `npm run dev` were all re-run clean in a fresh copy of this exact folder — 0 errors on any of them. If you've done the above and it's *still* blank, that's a real bug and not the file:// issue — tell me and I'll dig further with actual console output, not just my own re-testing.

---

Converts `frontend/` (plain HTML/CSS/JS) to React + Vite, matching the stack
documented in `docs/architecture.md` §3. This is a standalone project — it
has **not** been applied to the repository. Review it, then apply it
yourselves so the commit reflects who actually did the integration work.

## Why this exists
`docs/architecture.md` names React + Vite as the frontend stack, but what's
actually in the repo is vanilla HTML/CSS/JS across 5 separate pages. This is
the same category of problem as the `support_logic.py` → `.js` fix: a
documented stack that the actual code doesn't match.

## What's the same as the original
- Every page: Home, Order Status, Returns & Refunds, My Tickets, Profile
- The full visual design — `src/styles.css` is the original stylesheet,
  unchanged, aside from ~10 added lines for two elements that became
  `<button>`s instead of fake `<a href="javascript:void(0)">` links
- All interactive behavior: theme toggle (persisted to the same
  `localStorage` key, `northstar-theme`), notifications/help/profile
  dropdowns, mobile nav drawer, Contact/Settings/Sign-Out/Start-a-Return/
  Edit-Profile modals, order lookup with the same 3 sample orders, the
  returns FAQ accordion, knowledge-base search, ticket list

## What's different, and why
- **State lives in React**, not manual DOM queries — `src/context/` holds
  four small contexts (theme, toast, modal, profile) instead of `script.js`
  reaching into the DOM by ID.
- **Routing is client-side** (`react-router-dom`) instead of 5 separate
  `.html` files with full page reloads between them.
- **A real bug got fixed, not ported**: in the original, each modal's
  "success" confirmation (Contact, Start a Return, Edit Profile) is nested
  *inside* the `<form>` that gets hidden after submit. Combined with this
  codebase's `[hidden] { display: none !important; }` rule, that means the
  success message could never actually render — hidden along with its
  parent. Fixed here by making it a sibling instead of a child. Worth a
  quick look at the live original site to confirm this independently.

## How to run it
```
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run lint      # oxlint — should be clean except 4 harmless
                   # "Fast Refresh" warnings on the context files
```

## Verification performed
- `npm run build` succeeds with 0 errors (checked repeatedly through edits)
- `npm run lint` is clean (2 real issues it caught — a leftover dead
  conditional and an unused variable — were fixed; the remaining 4
  warnings are a stylistic Fast-Refresh convention, not bugs)
- Checked every ID-based CSS selector in the original stylesheet
  (`grep` for `#id { }` patterns) against the port — found and fixed one
  real gap: `#kbSearchInput`'s styling depends on that literal `id`, which
  had to be preserved explicitly since React state replaced most other IDs
- Checked every attribute-based CSS selector (`[aria-checked="true"]`,
  `[data-theme="dark"]`) against how React renders those props — confirmed
  boolean props render as the matching string automatically

## What I could NOT verify
I still don't have a way to open this in an actual browser and click around from my environment — that's unchanged. What I could do, and did: re-ran `npm install`, `npm run build`, `npm run dev`, and `npm run lint` fresh in this exact folder (0 errors on all four), and inspected the actual built `index.html` byte-for-byte to diagnose the reported blank-page symptom — see the troubleshooting note at the top of this file. If the file://-vs-server explanation doesn't match what's actually happening, that's a real signal something else is wrong, and worth telling me the exact steps taken so I can dig further.
