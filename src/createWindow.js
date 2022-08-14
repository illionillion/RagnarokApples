const { app, BrowserWindow } = require('electron')
require('dotenv').config({ path: __dirname + '/../.env' }) // .env読み込み

/**
 * ウィンドウを作成する
 */
 const createWindow = () => {
    return new Promise( async (resolve, reject) => {
        // ウィンドウを新たに開く
        const win = new BrowserWindow({
            width: 1042,
            minWidth: 1024,
            height: 810,
            minHeight: 768,
            icon: __dirname + '/app.png',
            webPreferences:{
                nodeIntegration:true,
            },
            show: false
        })
        win.once('ready-to-show', () => {
            // アスペクト比修正の挙動を隠すために遅延させる
            setTimeout(() => {
                win.show()
                resolve(win)
            }, 2000);
        })
        // 非パッケージ状態はローカルのフォルダを開く
        // win.loadURL('file://' + app.getPath('userData') + '/render.asar/index.html') // asarの中のアプリを開く // asarを開きたいときはこれ
        if (app.isPackaged) {
            win.loadURL('file://' + app.getPath('userData') + '/render.asar/index.html') // asarの中のアプリを開く
        } else {
            // console.log(__dirname + '/../' + process.env.LOCAL_BUILD_DIR + '/index.html');
            win.loadURL('file://' + __dirname + '/../' + process.env.LOCAL_BUILD_DIR + '/index.html') // LOCAL_BUILD_DIRフォルダ内のindex.htmlを開く
        }
    })

}

/**
 * ダウンロード中のスカッシュウィンドウ表示
 * @returns window
 */
const createSplash = () => {
    return new Promise( async (resolve, reject) => {
        const splash = new BrowserWindow({
            width: 300,
            height: 300,
            icon: __dirname + '/app.png',
            webPreferences:{
                nodeIntegration:true,
                enableRemoteModule: true,
                contextIsolation: true,
                preload: __dirname + '/loading.js' //プリロードスクリプト
            },
            frame: false ,
            titleBarStyle: 'hidden',
            resizable: false,
            show: false,
            fullscreen: false, // fn + F で拡大させない
        })
        splash.once('ready-to-show', () => {
            splash.show()
            resolve(splash)
        })
        splash.loadURL('file://' + __dirname + '/loading.html')
        // Mac 信号機ボタンを非表示
        if (process.platform === 'darwin') splash.setWindowButtonVisibility(false)
    })
}

exports.createWindow = createWindow
exports.createSplash = createSplash