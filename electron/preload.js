const { contextBridge, ipcRenderer, webFrame } = require("electron");

contextBridge.exposeInMainWorld("courseApi", {
  readJson(relativePath) {
    return ipcRenderer.invoke("read-app-json", relativePath);
  },
  setZoomFactor(factor) {
    webFrame.setZoomFactor(factor);
  },
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.runtime = "electron";
});
