/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, crashReporter, ipcMain } from 'electron';
import MenuBuilder from './menu';

// This gets rid of this: https://github.com/electron/electron/issues/13186
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

let mainWindow = null;
let splash = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')({ enabled: true });
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  app.quit();
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  // create a new `splash`-WindowF
  splash = new BrowserWindow({
    show: true,
    width: 850,
    height: 600,
    frame: false,
    backgroundColor: '#34495e',
    resizable: false
  });
  splash.loadURL(`file://${__dirname}/splash.html`);


  mainWindow = new BrowserWindow({
    show: false,
    width: 850,
    height: 600,
    minHeight: 600,
    minWidth: 780,
    frame: false,
    backgroundColor: '#34495e',
  });

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    splash.destroy();
    mainWindow.show();
    mainWindow.focus();
    
  });

  ipcMain.on('open-devTools', () => {
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  });

  ipcMain.on('setProgressTaskBar', (p) => {
    mainWindow.setProgressBar(p);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});