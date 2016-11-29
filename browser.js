var openExternal = require("open") // To open the default browser.
var BrowserWindow = require('browser-window') // Module to create native browser window.
var info_path = require('path').join(require('app').getPath("userData"), "tweetdeck-bounds-info.json")  // 画面サイズを保存しているjson
var bounds_file = require('fs') // jsonファイルの書き出し

var browserWindows = [] // An array of internal browser windows.

function cleanUp(window) {
  var position

  if (browserWindows[window] !== undefined) { position = window }
  else { position = browserWindows.indexOf(window) }

  if (position === -1) {
    throw new Error("Cannot clean up a browser window that is not in the browser window list")
  } else {
    browserWindows[position] = undefined
  }
}


// Our default web preferences
var defaultWebPreferences = {
  webPreferences: {
    nodeIntegration: false,
    webSecurity: true,
    allowDisplayingInsecureContent: false,
    allowRunningInsecureContent: false
  }
}

// Our default web preferences (Windows only!!)
var WindowsWebPreferences = {
  webPreferences: {
    defaultFontFamily: {
      standard: 'Meiryo',
      serif: 'MS PMincho',
      sansSerif: 'Meiryo',
      monospace: 'MS Gothic'
    },
    nodeIntegration: false,
    webSecurity: true,
    allowDisplayingInsecureContent: false,
    allowRunningInsecureContent: false
  }
}

// オブジェクトをマージする関数設定
function merge(obj1, obj2) {
    if (!obj2) {
        obj2 = {}
    }
    for (var attrname in obj2) {
        if (obj2.hasOwnProperty(attrname)) {
            obj1[attrname] = obj2[attrname]
        }
    }
}


function openTrusted(url) {
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md
  var options_info
  if (process.platform === 'win32') {
    options_info = WindowsWebPreferences
  }else {
    options_info = defaultWebPreferences
  }

  var bounds_info;
  try {
    bounds_info = JSON.parse(bounds_file.readFileSync(info_path, 'utf8'))
  }
  catch(e) {
    bounds_info = {width: 800, height: 1000}  // デフォルト
  }
  merge(options_info, bounds_info);

  // bounds_infoの結果を元にWindowのサイズを決定
  var newWindow = new BrowserWindow(options_info)

  newWindow.webContents.on('new-window', function(event, url, frameName, disposition, options) {
    openUrl(url, false, false)
    event.preventDefault()
  })

  newWindow.on('close', function() {
    // 閉じる前にWindowの位置とサイズを記憶する
    bounds_file.writeFileSync(info_path, JSON.stringify(newWindow.getBounds()))
    cleanUp(newWindow)
  })

  newWindow.loadURL(url)

  browserWindows[browserWindows.push(newWindow)-1] // Save the window
  return newWindow
}


// Open the window either with an external browser or the built in one.
// Note that secure only applies when internal is true.
// trusted is used for things like twitter's settings pages
function openUrl(url, internal, trusted) {
  if (internal === undefined) {
    // TODO: Use a regex to decide if the "internal" or external browser should be used.
    internal = false;
  }

  if (!internal) { // 内部ブラウザで開くフラグがfalseだったら
    openExternal(url)
  } else if (trusted) { // 信頼できるページだったら
    openTrusted(url)
  } else {
    // TODO: Make an internal web browser for non trusted pages
    throw new Error("Internal web browser for untrusted pages is not yet implemented.")
  }
}

// Export the functions
module.exports = {
  "openUrl": openUrl,
  "cleanUp": cleanUp
}
