// モジュールロード
const { app, Menu, BrowserWindow } = require('electron')
const { asarDownLoad } = require('./asarDownLoad.js')

//------------------------------------
// メニュー
//------------------------------------
// メニューを準備する
const template = Menu.buildFromTemplate([
    {
      label: "アプリ",
      submenu: [
        // { role:'close', label:'ウィンドウを閉じる' }
        { role:'togglefullscreen', label:'全画面切り替え' },
        { role:'quit', label:'アプリを終了' }
      ]
    },
    // {
    //   label: "編集",
    //   submenu: [
    //     { role:'undo',  label:'元に戻す' },
    //     { role:'redo',  label:'やり直す' },
    //     { type:'separator' },
    //     { role:'cut',   label:'切り取り' },
    //     { role:'copy',  label:'コピー' },
    //     { role:'paste', label:'貼り付け' },
    //   ]
    // }
]);

if (app.isPackaged) {//アプリがパッケージングされてる場合
    
    // メニューを適用する
    Menu.setApplicationMenu(template);
}

// 初期化が終了したらウィンドウをを新規に作成する
app.whenReady().then(asarDownLoad)

// 全てのウィンドウが閉じられた時の処理
app.on('window-all-closed', () => {
    // macOS以外はアプリを終了する
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// アプリがアクティブになった時
//(macOSはDocアイコンがクリックされたとき)
app.on('activate', () => {
    // ウィンドウがすべて閉じられている場合は新しく開く
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})