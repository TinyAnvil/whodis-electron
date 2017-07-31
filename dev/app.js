const Menubar = require('menubar');
const _ = require('underscore');
const { Menu, ipcMain } = require('electron');

const menubar = Menubar({
  preloadWindow: true,
  height: 240,
  y: 32
});

menubar.on('ready', () => {
  console.log('Application is ready.');

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu)
});

menubar.on('after-create-window', () => {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('resize', (event, height) => {
  menubar.window.setBounds(_.extend(menubar.window.getBounds(), {height: height}), true);
});

const template = [{
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function(item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload();
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function() {
      if (process.platform === 'darwin')
        return 'Alt+Command+I';
      else
        return 'Ctrl+Shift+I';
    })(),
    click: function(item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.toggleDevTools();
    }
  },
]}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  },{
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }]
}, {
  label: 'Whodis',
  submenu: [{
    label: 'Hide Whodis',
    accelerator: 'Command+H',
    role: 'hide'
  }, {
    label: 'Hide Others',
    accelerator: 'Command+Shift+H',
    role: 'hideothers'
  }, {
    label: 'Show All',
    role: 'unhide'
  }, {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function() { menubar.app.quit(); }
  }]
}];