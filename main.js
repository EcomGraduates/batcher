const { app, BrowserWindow } = require('electron')
var path = require('path')

let mainWindow;

  function createWindow () {

    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800,
       height: 600,
       icon: path.join(__dirname, 'assets/icons/png/copy.png') })
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }
  
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
    if (mainWindow === null) {
      createWindow()
    }
  })
  