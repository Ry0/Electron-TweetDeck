var openExternal = require("open") // To open the default browser.
var BrowserWindow = require('browser-window')	// Module to create native browser window.
var info_path = require('path').join(require('app').getPath("userData"), "tweetdeck-bounds-info.json")	// 画面サイズを保存しているjson
var bounds_file = require('fs')	// jsonファイルの書き出し

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
	"node-integration": false,
	"web-security": true,
	"allow-displaying-insecure-content": false,
	"allow-running-insecure-content": false
}

function openTrusted(url) {
	var bounds_info;
	try {
		bounds_info = JSON.parse(bounds_file.readFileSync(info_path, 'utf8'))
	}
	catch(e) {
		bounds_info = {width: 800, height: 1000}  // デフォルト
	}

	// bounds_infoの結果を元にWindowのサイズを決定
	var newWindow = new BrowserWindow(bounds_info, {"web-preferences": defaultWebPreferences})

	newWindow.webContents.on('new-window', function(event, url, frameName, disposition, options) {
		openUrl(url)
		event.preventDefault()
	})

	newWindow.on('close', function() {
		// 閉じる前にWindowの位置とサイズを記憶する
		bounds_file.writeFileSync(info_path, JSON.stringify(newWindow.getBounds()))
		cleanUp(newWindow)
	})

	newWindow.loadUrl(url)

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

	if (!internal) {
		openExternal(url)
	} else if (trusted) {
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
