/**
 * Last update: 20/10/2019
 */

'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import { eventTypes } from "./enums/events";
import { 
  connection,
  insertPlayer,
  createGame,
  getAllLevels,
  updateGamePlaylist,
  getGameInfos,
  updateScore
} from "./database";
import { 
  extractSongs,
  createPlaylists,
  assignSongsToPlaylist,
  createLevels,
} from './songs';

import { series, apply } from "async";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Two windows : one for the admin, and one for the players
let adminWindow = null;
let gameWindow= null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindows () {
  /**
   * Create the App Windows
   */
  createAdminWindow()

  /**
   * Use win.webContents.send to communicate between windows, if event send to same windows use e.reply.
   */
  const replyOnAllWindows = (eventInstance, channel, message) => {
    eventInstance.reply(channel, message);
    adminWindow.webContents.send(channel, message);
    gameWindow.webContents.send(channel, message);
  }

  // Events listing and management
  // On game cancellation
  const eventGameCancel = eventTypes.gameCancellation;
  ipcMain.on(eventGameCancel, (e) => {
    replyOnAllWindows(e, eventGameCancel);
  });

  // On game creation
  const eventGameCreate = eventTypes.gameCreation;
  ipcMain.on(eventGameCreate, (e) => {
    createGame((err, res) => {
      if (err) throw err;
      replyOnAllWindows(e, eventGameCreate, res.insertId);
    });
  });

  // On player creation
  const eventPlayerCreate = eventTypes.createPlayer;
  ipcMain.on(eventPlayerCreate, (e, data) => {
    insertPlayer(data, (err, res) => {
      if (err) throw err;
      replyOnAllWindows(e, eventPlayerCreate, res);
    });
  });

  // On launching game event 
  const eventLaunchGame = eventTypes.launchGame;
  ipcMain.on(eventLaunchGame, (e, data) => {
    updateGamePlaylist(data.gameId, data.playlistId, err => {
      if (err) throw err;
      replyOnAllWindows(e, eventLaunchGame, data);
    });
  });

  // On get all levels event 
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

  // Point updated
  const eventScoreUpdated = eventTypes.scoreUpdate;
  ipcMain.on(eventScoreUpdated, (e, { player, gameId }) => {
    updateScore(player, gameId, err => {
      if (err) throw err;
      replyOnAllWindows(e, eventScoreUpdated, player);
    });
  });
}

function createAdminWindow() {
  /**
   * Create the Admin Window
   */
  adminWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true }, show: false })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    adminWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#admin')
    if (!process.env.IS_TEST) adminWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    adminWindow.loadURL('app://./index.html#admin')
  }

  adminWindow.on('closed', () => {
    if(gameWindow)
      gameWindow.close()

    adminWindow = null;
    connection.end();
  })

  adminWindow.once('ready-to-show', () => {
    adminWindow.maximize();
    adminWindow.show();
    createGameWindow();
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
}

function createGameWindow () {
  /**
   * Create the Game Window
   */
  gameWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true }, show: false })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    gameWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#game')
    if (!process.env.IS_TEST) gameWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    gameWindow.loadURL('app://./index.html#game')
  }

  gameWindow.on('closed', () => { gameWindow = null })

  gameWindow.once('ready-to-show', () => {
    gameWindow.maximize();
    gameWindow.show();
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
  if (adminWindow === null && gameWindow === null)
    createWindows();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindows();
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
