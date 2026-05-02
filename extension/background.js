const SLASHY_BASE = "https://slashy.com";

function buildUrl(query) {
  if (!query || !query.trim()) return `${SLASHY_BASE}/`;
  return `${SLASHY_BASE}/?q=${encodeURIComponent(query.trim())}`;
}

function openSlashy(query) {
  chrome.tabs.create({ url: buildUrl(query) });
}

chrome.omnibox.setDefaultSuggestion({
  description: "Ask Slashy: <match>%s</match>"
});

chrome.omnibox.onInputEntered.addListener((text) => {
  openSlashy(text);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-slashy") openSlashy("");
});

chrome.action.onClicked.addListener(() => {
  openSlashy("");
});
