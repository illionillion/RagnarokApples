const { app, BrowserWindow } = require('electron')

/**
 * ウィンドウを作成する
 */
 const createWindow = () => {
    // ウィンドウを新たに開く
    const win = new BrowserWindow({
        width: 1042,
        minWidth: 1024,
        height: 810,
        minHeight: 768,
        icon: __dirname + '/app.png',
        webPreferences:{
            nodeIntegration:true
        },
        show: false
    })
    win.once('ready-to-show', () => {
        //アスペクト比修正の挙動を隠すために遅延させる
        setTimeout(() => {
            win.show()
        }, 2000);
    })
    win.loadURL('file://' + app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く

}

/**
 * ダウンロード中のスカッシュウィンドウ表示
 * @returns window
 */
const createSplash = () => {
    const splash = new BrowserWindow({
        width: 300,
        height: 300,
        icon: __dirname + '/app.png',
        webPreferences:{
            nodeIntegration:true
        },
        frame: false ,
        titleBarStyle: 'hidden',
        resizable: false,
        show: false
    })
    splash.once('ready-to-show', () => {
        splash.show()
    })
    splash.loadURL('file://' + __dirname + '/loading.html')
        
    return splash
}

exports.createWindow = createWindow
exports.createSplash = createSplash