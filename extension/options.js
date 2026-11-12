const toggle = document.getElementById("toggle");
const store = globalThis.chrome?.storage?.local;

function render(enabled) {
  toggle.checked = enabled;
  document.getElementById("state").textContent = enabled ? "On" : "Off";
  document.getElementById("status").textContent = enabled
    ? "On. Chrome allows cross-origin requests."
    : "Off. Chrome applies normal cross-origin rules.";
  document.getElementById("warning").hidden = !enabled;
  document.getElementById("logo").src = `icons/icon-${enabled ? "on" : "off"}-128.png`;
}

if (store) {
  store.get({ enabled: false }).then(({ enabled }) => render(enabled));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && "enabled" in changes) render(changes.enabled.newValue === true);
  });
  toggle.addEventListener("change", () => store.set({ enabled: toggle.checked }));
} else {
  // Opened outside the extension (store screenshots, site preview): ?state=on shows the on state.
  render(new URLSearchParams(location.search).get("state") === "on");
  toggle.addEventListener("change", () => render(toggle.checked));
}
