const electron = require('electron')
const app = electron.app
const Menu = electron.Menu;
const join = require('path').join;
const browser = require('./browser.js')
const openAboutWindow = require('about-window').default;
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

  const menu = Menu.buildFromTemplate([
      {
          label: 'Help',
          submenu: [
              {
                  label: 'About This App',
                  click: () => openAboutWindow({
                              icon_path: join(__dirname, './icon/about.png'),
                              copyright: 'Ry0_Ka',
                              bug_report_url: 'https://twitter.com/Ry0_Ka',
                              homepage: 'http://ry0.github.io/',
                              description: 'このアプリはElectronを使ったプログラミングの練習として作成されました．'
                          })
              }
          ]
      }
  ]);
  Menu.setApplicationMenu(menu);
})
