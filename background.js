const DEFAULT_LABELS = {
  "Email": "myemail@example.com",
  "Address": "123 Main St",
  "Signature": "Best regards,\nJohn"
};

async function buildMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "pasteRoot",
      title: "Label Paste",
      contexts: ["editable"]
    });
    chrome.storage.local.get("labels", (data) => {
      const labels = data.labels || DEFAULT_LABELS;
      for (const name of Object.keys(labels)) {
        chrome.contextMenus.create({
          id: "paste_" + name,
          parentId: "pasteRoot",
          title: name,
          contexts: ["editable"]
        });
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(buildMenu);
chrome.runtime.onStartup.addListener(buildMenu);
chrome.storage.onChanged.addListener(buildMenu);

// Handle click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("paste_")) {
    const key = info.menuItemId.replace("paste_", "");
    chrome.storage.local.get("labels", (data) => {
      const labels = data.labels || DEFAULT_LABELS;
      const text = labels[key] || "";
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (t) => {
          const el = document.activeElement;
          if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            const start = el.selectionStart ?? el.value.length;
            const end = el.selectionEnd ?? el.value.length;
            el.value = el.value.slice(0, start) + t + el.value.slice(end);
            el.selectionStart = el.selectionEnd = start + t.length;
            el.dispatchEvent(new Event("input", { bubbles: true }));
          } else if (el && el.isContentEditable) {
            document.execCommand("insertText", false, t);
          }
        },
        args: [text]
      });
    });
  }
});