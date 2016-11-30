"use strict"
const electron = require('electron')
const app = electron.app;
const Menu = electron.menu // Control the menubar of the program.
const browser = require('./browser.js')

// Report crashes
const crashReporter = electron.crashReporter
crashReporter.start({
  productName: 'Electron-TweetDeck',
  companyName: 'Ry0',
  submitURL: 'https://github.com/Ry0/Electron-TweetDeck/pulls',
  autoSubmit: false
})

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = browser.openUrl('https://tweetdeck.twitter.com', true, true)
})
