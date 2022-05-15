const { app, Menu, BrowserWindow } = require('electron')

/**
 * ウィンドウを作成する
 */
const createWindow = () =>{
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
        // frame: false 
        // titleBarStyle: 'hidden'
    })
    
    // ここで開く前にレンダラーのasarをサーバーから差し替え
    // ファイルを開く
    if (app.isPackaged) {//アプリがパッケージングされてる場合
        win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く
    }else{
        win.loadURL(__dirname + '/render.asar/index.html') //asarの中のアプリを開く
    }
    
    // if (app.isPackaged) {
    // //    // メニューバー非表示
    //     win.setMenuBarVisibility(false);//Windowsのみ可能
    // }
    // win.setMenuBarVisibility(false);//Windowsのみ可能

}

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
app.whenReady().then(createWindow)

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