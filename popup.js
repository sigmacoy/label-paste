function render() {
  chrome.storage.local.get("labels", (data) => {
    const labels = data.labels || {};
    const list = document.getElementById("list");
    list.innerHTML = "";
    
    const entries = Object.entries(labels);
    if (entries.length === 0) {
      list.innerHTML = '<div class="empty-state">No labels found. Add one below!</div>';
      return;
    }
    
    for (const [k, v] of entries) {
      const row = document.createElement("div");
      row.className = "row";
      
      const textContainer = document.createElement("div");
      textContainer.className = "row-text";
      
      const nameEl = document.createElement("div");
      nameEl.className = "row-name";
      nameEl.textContent = k;
      
      const valEl = document.createElement("div");
      valEl.className = "row-val";
      valEl.textContent = v;
      
      textContainer.appendChild(nameEl);
      textContainer.appendChild(valEl);
      
      const btn = document.createElement("button");
      btn.className = "del";
      btn.dataset.k = k;
      btn.title = "Delete label";
      // Trash SVG icon
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
      
      btn.onclick = () => {
        chrome.storage.local.get("labels", (d) => {
          const l = d.labels || {};
          delete l[btn.dataset.k];
          chrome.storage.local.set({ labels: l }, render);
        });
      };
      
      row.appendChild(textContainer);
      row.appendChild(btn);
      list.appendChild(row);
    }
  });
}

document.getElementById("save").onclick = () => {
  const nameInput = document.getElementById("name");
  const valueInput = document.getElementById("value");
  const name = nameInput.value.trim();
  const value = valueInput.value;
  
  if (!name || !value) {
    return;
  }
  
  chrome.storage.local.get("labels", (d) => {
    const l = d.labels || {};
    l[name] = value;
    chrome.storage.local.set({ labels: l }, () => {
      nameInput.value = "";
      valueInput.value = "";
      render();
    });
  });
};

render();