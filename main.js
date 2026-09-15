const { app, BrowserWindow } = require('electron');
const path = require('path');

// 1. Chống mở 2 ứng dụng cùng lúc (Single Instance Lock)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Nếu đã có 1 cửa sổ đang chạy thì thoát ngay cửa sổ thứ hai
  app.quit();
} else {
  let win = null;

  function createWindow() {
    win = new BrowserWindow({
      width: 1366,
      height: 768,
      minWidth: 1024,
      minHeight: 700,
      title: "Hệ Thống Sát Hạch Lý Thuyết GPLX Mô Tô",
      icon: path.join(__dirname, 'icon.ico'),
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    win.loadFile(path.join(__dirname, 'index.html'));

    // Tự động phóng to toàn màn hình
    win.maximize();

    win.on('closed', () => {
      win = null;
    });
  }

  // Khi có ai đó cố mở thêm lần nữa, tự động focus vào cửa sổ đã có
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // Chỉ gọi createWindow() ĐÚNG 1 LẦN khi Electron đã sẵn sàng
  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}