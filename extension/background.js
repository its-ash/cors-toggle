// While on, one dynamic rule adds permissive CORS headers to every fetch/XHR response.
const RULE_ID = 1;

const RULE = {
  id: RULE_ID,
  priority: 1,
  action: {
    type: "modifyHeaders",
    responseHeaders: [
      { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
      { header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" },
      { header: "Access-Control-Allow-Headers", operation: "set", value: "*" },
      { header: "Access-Control-Expose-Headers", operation: "set", value: "*" },
    ],
  },
  condition: { resourceTypes: ["xmlhttprequest"] },
};

const icons = (state) => Object.fromEntries([16, 32, 48, 128].map((s) => [s, `icons/icon-${state}-${s}.png`]));

async function apply(enabled) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: enabled ? [RULE] : [],
  });
  await chrome.action.setIcon({ path: icons(enabled ? "on" : "off") });
  await chrome.action.setBadgeText({ text: enabled ? "ON" : "" });
  await chrome.action.setBadgeBackgroundColor({ color: "#0b57d0" });
  await chrome.action.setTitle({ title: enabled ? "CORS Toggle: on (click to turn off)" : "CORS Toggle: off (click to turn on)" });
}

const isEnabled = async () => (await chrome.storage.local.get({ enabled: false })).enabled;

// Storage is the single source of truth; the toolbar click and the options page both just write to it.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "enabled" in changes) apply(changes.enabled.newValue === true);
});

chrome.action.onClicked.addListener(async () => {
  await chrome.storage.local.set({ enabled: !(await isEnabled()) });
});

chrome.runtime.onStartup.addListener(async () => apply(await isEnabled()));

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  await apply(await isEnabled());
  if (reason === "install") chrome.runtime.openOptionsPage();
});
