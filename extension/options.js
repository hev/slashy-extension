const radios = document.querySelectorAll('input[name="redirectMode"]');
const saved = document.getElementById("saved");

chrome.storage.sync.get("redirectMode", ({ redirectMode = "ask" }) => {
  for (const r of radios) r.checked = r.value === redirectMode;
});

for (const r of radios) {
  r.addEventListener("change", async (e) => {
    await chrome.storage.sync.set({ redirectMode: e.target.value });
    saved.classList.add("show");
    setTimeout(() => saved.classList.remove("show"), 1200);
  });
}
