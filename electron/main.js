const path = require("path");
const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain, shell } = require("electron");

const appDir = path.join(__dirname, "..", "app");
const materialsDir = path.join(__dirname, "..", "materials");
const materialSubjects = {
  microcomputer: "microcomputer",
};
const materialCategories = {
  ppt: "上课PPT",
  papers: "试卷原卷",
};

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

  ipcMain.handle("list-material-files", async (_event, subjectId, category) => {
    try {
      const subjectDir = materialSubjects[subjectId];
      const categoryDir = materialCategories[category];
      if (!subjectDir || !categoryDir) {
        return { ok: false, error: "未找到课程资料分类。" };
      }

      const resolved = path.resolve(materialsDir, subjectDir, categoryDir);
      if (!resolved.startsWith(`${materialsDir}${path.sep}`)) {
        return { ok: false, error: "非法的资料路径。" };
      }

      const entries = await fs.readdir(resolved, { withFileTypes: true });
      return {
        ok: true,
        files: entries
          .filter((entry) => entry.isFile())
          .map((entry) => entry.name)
          .sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true })),
      };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle("open-material-file", async (_event, subjectId, category, fileName) => {
    try {
      const subjectDir = materialSubjects[subjectId];
      const categoryDir = materialCategories[category];
      if (!subjectDir || !categoryDir || typeof fileName !== "string" || fileName.includes("/") || fileName.includes("\\")) {
        return { ok: false, error: "未找到课程资料文件。" };
      }

      const resolved = path.resolve(materialsDir, subjectDir, categoryDir, fileName);
      if (!resolved.startsWith(`${materialsDir}${path.sep}`)) {
        return { ok: false, error: "非法的资料路径。" };
      }

      const error = await shell.openPath(resolved);
      return error ? { ok: false, error } : { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
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
