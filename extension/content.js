const SLASHY_URL = "https://slashy.com/inbox?from=gmail";
const SESSION_DISMISS_KEY = "slashy_dismissed_this_session";

function isInboxRoot() {
  const hash = window.location.hash || "#inbox";
  return hash === "#inbox" || hash === "" || hash === "#";
}

async function getRedirectMode() {
  const { redirectMode = "ask" } = await chrome.storage.sync.get("redirectMode");
  return redirectMode;
}

function redirect() {
  window.location.replace(SLASHY_URL);
}

function injectBanner() {
  if (document.getElementById("slashy-banner")) return;
  if (sessionStorage.getItem(SESSION_DISMISS_KEY) === "1") return;

  const bar = document.createElement("div");
  bar.id = "slashy-banner";
  bar.innerHTML = `
    <div class="slashy-banner-inner">
      <span class="slashy-banner-mark">/</span>
      <span class="slashy-banner-text">Open this inbox in <strong>Slashy</strong>?</span>
      <button class="slashy-btn slashy-btn-primary" data-action="open">Open</button>
      <button class="slashy-btn" data-action="always">Always</button>
      <button class="slashy-btn slashy-btn-ghost" data-action="dismiss" aria-label="Dismiss">Not now</button>
    </div>
  `;
  document.documentElement.appendChild(bar);

  bar.addEventListener("click", async (e) => {
    const action = e.target?.dataset?.action;
    if (!action) return;
    if (action === "open") {
      redirect();
    } else if (action === "always") {
      await chrome.storage.sync.set({ redirectMode: "always" });
      redirect();
    } else if (action === "dismiss") {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
      bar.remove();
    }
  });
}

(async function main() {
  if (!isInboxRoot()) return;
  const mode = await getRedirectMode();
  if (mode === "never") return;
  if (mode === "always") {
    redirect();
    return;
  }
  injectBanner();
})();
