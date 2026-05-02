# Slashy browser extension — prototype

A throwaway prototype to start a conversation with the Slashy team about owning a slice of the browser.

## The pitch in one paragraph

People type `gmail.com` from muscle memory and never make it to `slashy.com`. A redirect alone is a thin reason to install an extension — but if the same install also gives users a global launcher (`slashy <query>` in the address bar, or `⌘⇧L` from anywhere), the install ask becomes "put Slashy one keystroke away from every tab" instead of "fix a typo for us." That reframing is the whole point of the prototype.

## What this prototype includes

**v0.1 — Smart redirect**
- Content script on `mail.google.com` shows a soft banner: *Open this inbox in Slashy?*
- Buttons: **Open** (one-time), **Always** (sets a pref + redirects), **Not now** (dismisses for the session).
- Options page lets the user flip between Ask / Always / Never at any time.
- Only fires on the bare inbox URL — deep links to threads, search, and compose are left alone.
- Redirect carries intent: lands on `slashy.com/inbox?from=gmail`, not the marketing homepage.

**v0.2 prototype — Launcher**
- Omnibox keyword: type `slashy` then space, then any query, in the address bar.
- Global hotkey: `⌘⇧L` on Mac, `Ctrl+Shift+L` elsewhere.
- Toolbar icon also opens Slashy.
- Both routes funnel through one handler so behavior stays consistent.

## What this prototype does *not* include (on purpose)

- **No auth.** The launcher just opens `slashy.com/?q=...` — Slashy handles the session.
- **No icons.** Chrome will show its default extension icon. Drop real PNGs in and reference them from `manifest.json` when ready.
- **No notifications, no badge, no context-menu capture.** Those are v0.3+.
- **No build step, no dependencies.** Plain JS, plain CSS, plain HTML. Anyone on the team can read or change it in five minutes.

## Permissions footprint

Deliberately tiny — this matters for both Web Store review speed and the install-time scariness dialog:

| Permission | Why |
| --- | --- |
| `storage` | Persist the redirect-mode preference. |
| `host_permissions: https://mail.google.com/*` | Inject the banner. Nothing else. |
| `omnibox` | Address-bar keyword. No host access. |
| `commands` | Hotkey. No host access. |

Notably absent: `<all_urls>`, `cookies`, `tabs` (broad), `notifications`. Each has been avoided to keep the install ask trivial.

## How to load it

1. Open Chrome → `chrome://extensions`.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and pick the `extension/` folder.
4. The Slashy icon appears in the toolbar.

## Demo script for the Slashy team

Two minutes, in this order:

1. **Visit `mail.google.com`.** Banner slides in along the top. Hit **Open** — lands on `slashy.com/inbox?from=gmail`. *("That's the muscle-memory fix.")*
2. **Open a new tab, type `slashy follow up with finance` in the address bar.** Lands on Slashy with the query pre-filled. *("And that's why people install it even if they don't use Gmail.")*
3. **From any random tab, hit `⌘⇧L`.** Slashy opens. *("This is the part that matters. We're not fixing a typo — we're claiming a keystroke.")*
4. **Open `chrome://extensions` → Slashy → Details → Extension options.** Show the Always/Ask/Never toggle. *("And we never surprise users — they stay in control.")*

## Where this could go next

In rough ship-order, each phase is a self-contained PR's worth of work:

- **v0.3 — Right-click "Email about this."** Context-menu capture from any page or selection. Needs a Slashy `POST /api/draft-from-context` endpoint that returns a draft URL.
- **v0.4 — Toolbar badge.** Service worker polls a Slashy `agent-status` endpoint and updates the icon badge.
- **v0.5 — Notifications.** Native browser notifications gated behind an explicit opt-in screen (never at install).
- **Later — Push instead of polling, Firefox/Edge ports, OAuth via `chrome.identity` once the launcher needs to know who you are.**

## Files

```
extension/
├── manifest.json     MV3 manifest, narrow permissions
├── background.js     Omnibox + hotkey + toolbar handler
├── content.js        Soft-redirect banner injection
├── content.css       Banner styles (scoped to #slashy-banner)
├── options.html      Preferences UI
└── options.js        Preferences logic
```

Total: ~250 lines including styles. Intentionally small.
