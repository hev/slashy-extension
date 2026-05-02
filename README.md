# Slashy browser extension (POC)

A small browser extension that puts [Slashy](https://slashy.com) one keystroke away from any tab and gently nudges Gmail visits over to Slashy.

## What it does

- **Soft redirect from Gmail.** When you open `mail.google.com`, a small banner appears at the top of the page: *"Open this inbox in Slashy?"* You can open once, set it to always redirect, or dismiss for the session.
- **Address-bar launcher.** Type `slashy` in the address bar, hit space (or tab), and any text you type after that opens in Slashy as a query.
- **Global hotkey.** Press `⌥⇧L` (Mac) or `Alt+Shift+L` (Windows/Linux) from any tab to open Slashy.
- **Toolbar icon.** Clicking the extension icon also opens Slashy.
- **Preferences.** A tiny options page lets you switch the Gmail behavior between *Ask*, *Always redirect*, and *Never*.

The redirect only fires on the bare inbox URL — deep links to specific threads, search results, and compose windows are left alone.

## Install

This isn't on the Chrome Web Store. Load it unpacked:

1. Clone the repo: `git clone https://github.com/hev/slashy-extension.git`
2. Open `chrome://extensions` in Chrome (or any Chromium browser: Edge, Brave, Arc).
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and select the `extension/` folder from the cloned repo.

The extension appears in the toolbar as "Slashy (POC)".

## Usage

| Action | How |
| --- | --- |
| Open Slashy from any tab | `⌥⇧L` / `Alt+Shift+L` |
| Search Slashy from the address bar | `slashy <space> your query` |
| Open Slashy via toolbar | Click the extension icon |
| Change Gmail redirect behavior | Right-click toolbar icon → Options |

If the hotkey conflicts with another extension, rebind it at `chrome://extensions/shortcuts`.

## Known issues

- **Address-bar launcher (`slashy <query>`) is flaky.** Chrome's omnibox keyword feature only kicks in once Chrome treats `slashy` as a registered keyword search. If typing `slashy` in the address bar just runs a Google search instead of showing the *"Ask Slashy:"* prompt, do one of the following:
  - Type `slashy` and then press `Tab` (not space) to force keyword mode.
  - Or open `chrome://settings/searchEngines`, find **Slashy** under *Site search*, and click **Activate**.
  - The hotkey and toolbar icon are reliable workarounds while this is being sorted.

## Permissions

Kept deliberately narrow:

| Permission | Why |
| --- | --- |
| `storage` | Persist the redirect-mode preference. |
| `host_permissions: https://mail.google.com/*` | Inject the redirect banner. |
| `omnibox` | Address-bar keyword. No host access. |
| `commands` | Global hotkey. No host access. |

The extension does **not** request `<all_urls>`, `cookies`, `tabs`, or `notifications`.

## Roadmap

Ideas being explored, roughly in order:

- **Right-click "Email about this."** Context menu entries on any page or selection that open Slashy with the page title, URL, and selected text pre-loaded as draft context.
- **Toolbar badge.** Surface unread or agent-flagged items as a number on the extension icon, polled from a Slashy status endpoint.
- **Native notifications.** Browser notifications for agent-flagged items, gated behind an explicit opt-in (never asked at install time).
- **OAuth sign-in.** Use `chrome.identity.launchWebAuthFlow` so the extension knows who you are and can call Slashy APIs directly.
- **Push channel.** Replace badge polling with Web Push or a long-lived connection.
- **Cross-browser.** Firefox and Safari ports.

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

No build step, no dependencies. Plain JS, plain CSS, plain HTML.

## License

MIT.
