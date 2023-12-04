/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

let appDir: string;
let userDataPath: string;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const userDir = app.getPath('userData');
  appDir = path.join(userDir, 'Eaon');

  console.log(appDir);

  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  // Creation d'un fichier pour stocker les informations utilisateurs
  userDataPath = path.join(appDir, 'userInfo.json');

  if (!fs.existsSync(userDataPath)) {
    const userInfo = [
      {
        firstname: '',
        birthDate: '',
        language: '',
        theme: '',
      },
    ];
    fs.writeFile(
      userDataPath,
      JSON.stringify(userInfo, null, 2),
      'utf-8',
      (err: any) => {
        console.error(
          "Une erreur s'est produite lors de la création du fichier userInfo.json",
          err,
        );
      },
    );
  } else {
    fs.readFile(userDataPath, 'utf-8', (err, fileData) => {
      if (err) console.log('Erreur de lecture du fichier userInfo.json', err);

      try {
        const userInfo = JSON.parse(fileData);
        const isUserInfoComplete = Object.values(userInfo[0]).every(Boolean);

        console.log(isUserInfoComplete);

        if (!isUserInfoComplete) {
          /* empty */
        }
      } catch (errP) {
        console.error('Erreur de parsing du fichier userInfo.json', errP);
      }
    });
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
ipcMain.on('save-user-info', (event, data) => {
  fs.readFile(userDataPath, 'utf-8', (err, fileData) => {
    if (err) console.log('Erreur de lecture du fichier userInfo.json', err);

    try {
      const userInfo = JSON.parse(fileData);
      // Mise à jour des données avec les nouvelles informations
      userInfo[0] = { ...userInfo[0], ...data };

      // Écriture des données mises à jour dans le fichier
      fs.writeFile(
        userDataPath,
        JSON.stringify(userInfo, null, 2),
        'utf-8',
        (errW) => {
          if (err) {
            console.error(
              "Erreur lors de l'écriture dans le fichier userInfo.json",
              errW,
            );
            return;
          }
          console.log(
            'Données enregistrées avec succès dans le fichier userInfo.json',
          );
        },
      );
    } catch (errP) {
      console.error('Erreur de parsing du fichier userInfo.json', errP);
    }
  });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
