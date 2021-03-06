'use strict';

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const user32 = require('./app/scripts/user32').User32

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let mainWin
const ipc=require('electron').ipcMain
const { remote } =require('electron')
let newwin;
ipc.on('add',()=>{
    win.close();
    newwin=newBrowserWindow({
        width: 800,
        height: 600,
        frame:false,
        maximizable:true,
        closable:true,
        parent: win, //win是主窗口    
        webPreferences: {
            nodeIntegration: true
        }
    })
    newwin.loadURL(path.join('file:',__dirname,'app/login.html')); //new.html是新开窗口的渲染进程
    newwin.on('closed',()=>{newwin=null});
})

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 495, height: 470, /*skipTaskbar: true,*/ frame: false,
        resizable: false, maximizable: false, transparent: true, show: false, alwaysOnTop: true
    })

    mainWin = new BrowserWindow({
        width: 495, height: 470, show: false
    })

    win.once('ready-to-show', () => {
        let hwnd = win.getNativeWindowHandle()
        user32.GetSystemMenu(hwnd.readUInt32LE(0), true)
        win.show()
    })

    mainWin.once('ready-to-show', () => {
        mainWin.maximize()
        mainWin.show()
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null

        // mainWin.loadURL("http://www.baidu.com");
        mainWin.loadURL(path.join('file:',__dirname,'app/login.html'));
    })
}

//app.disableHardwareAcceleration();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
