'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
} from 'vue-cli-plugin-electron-builder/lib'
import { eventTypes } from "./enums/events";
import { 
  connection,
  insertPlayer,
  createGame,
  getAllLevels,
  updateGamePlaylist,
  getGameInfos,
} from "./database";
import { 
  extractSongs,
  createPlaylists,
  assignSongsToPlaylist,
  createLevels
} from './songs';

import { series, apply } from "async";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  }, show: false })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null;
    connection.end();
  })

  win.once('ready-to-show', () => {
    win.show();
    createPlayersWindow();
    connection.connect();
    series([
      apply(extractSongs),
      apply(createLevels),
      apply(createPlaylists),
      apply(assignSongsToPlaylist)
    ], err => {
      if (err) throw err;
    });
  })

  /**
   * Use win.webContents.send to communicate between windows, if event send to same windows use e.reply.
   */
  const replyOnAllWindows = (eventInsance, channel, message) => {
    eventInsance.reply(channel, message);
    win.webContents.send(channel, message);
  }

  // On game creation
  const eventGameCreate = eventTypes.gameCreation;
  ipcMain.on(eventGameCreate, (e) => {
    createGame((err, res) => {
      if (err) throw err;
      replyOnAllWindows(e, eventGameCreate, res.insertId);
    });
  });

  // on player creation
  const eventPlayerCreate = eventTypes.createPlayer;
  ipcMain.on(eventPlayerCreate, (e, data) => {
    insertPlayer(data, (err, res) => {
      if (err) throw err;
      replyOnAllWindows(e, eventPlayerCreate, res);
    });
  });

  // on launching game event 
  const eventLaunchGame = eventTypes.launchGame;
  ipcMain.on(eventLaunchGame, (e, data) => {
    updateGamePlaylist(data.gameId, data.playlistId, err => {
      if (err) throw err;
      replyOnAllWindows(e, eventPlayerCreate, data);
    });
  });

  // on get all levels event 
  const eventGetLevels = eventTypes.getAllLevels;
  ipcMain.on(eventGetLevels, e => {
    getAllLevels((err, res) => {
      if (err) throw err;
      replyOnAllWindows(e, eventGetLevels, res);
    });
  });

  const eventGetGame = eventTypes.getGame;
  ipcMain.on(eventGetGame, (e, gameId) => {
    getGameInfos(gameId, (err, game) => {
      if (err) throw err;
      replyOnAllWindows(e, eventGetGame, game);
    });
  });
}

function createPlayersWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  }, show: false })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#players')
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html#players')
  }

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    win.show();
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
