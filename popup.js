function render() {
  chrome.storage.local.get("labels", (data) => {
    const labels = data.labels || {};
    const list = document.getElementById("list");
    list.innerHTML = "";
    for (const [k, v] of Object.entries(labels)) {
      const row = document.createElement("div");
      row.innerHTML = `<b>${k}</b>: ${v}
        <button data-k="${k}" class="del">✕</button>`;
      list.appendChild(row);
    }
    document.querySelectorAll(".del").forEach(btn => {
      btn.onclick = () => {
        chrome.storage.local.get("labels", (d) => {
          const l = d.labels || {};
          delete l[btn.dataset.k];
          chrome.storage.local.set({ labels: l }, render);
        });
      };
    });
  });
}

document.getElementById("save").onclick = () => {
  const name = document.getElementById("name").value.trim();
  const value = document.getElementById("value").value;
  if (!name) return;
  chrome.storage.local.get("labels", (d) => {
    const l = d.labels || {};
    l[name] = value;
    chrome.storage.local.set({ labels: l }, render);
  });
};

render();