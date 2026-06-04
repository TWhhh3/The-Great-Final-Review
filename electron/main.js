const path = require("path");
const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain } = require("electron");

const appDir = path.join(__dirname, "..", "app");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 680,
    icon: path.join(appDir, "assets", "icon.ico"),
    backgroundColor: "#f4f6f8",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(appDir, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("read-app-json", async (_event, relativePath) => {
    try {
      const resolved = path.resolve(appDir, relativePath);
      if (resolved !== appDir && !resolved.startsWith(`${appDir}${path.sep}`)) {
        return {
          ok: false,
          error: "非法的数据文件路径。",
        };
      }
      const content = await fs.readFile(resolved, "utf8");
      return {
        ok: true,
        data: JSON.parse(content),
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
