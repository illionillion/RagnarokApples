// モジュールロード
const { app, Menu, BrowserWindow } = require('electron')
const https = require('https')
const originalfs = require('original-fs');
const request = require('request');

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
        // frame: false ,
        // titleBarStyle: 'hidden'
    })
    // if (app.isPackaged) {//アプリがパッケージングされてる場合
        // ここで開く前にレンダラーのasarをサーバーから差し替え
        // URLを指定 
        const url = 'https://drive.google.com/uc?id=1mHfOd4seMjFuknv6hB1C55U9kMiw64sN&confirm=t';
        
        // 出力ファイル名を指定
        const outFile = originalfs.createWriteStream(app.getPath('userData') + '/render.asar');
        let splashWin
        // const outFile = originalfs.createWriteStream('./rendertest.asar');

        // request使わずにダウンロード
        // const req = https.request(url, (res) => {
        //     // res.pipe(outFile)
        //     res.on('data', (chunk) => {
        //         console.log(`BODY: ${chunk}`);
        //     });
        //     res.on('readable', () => {
        //         req.pipe(outFile)
        //     })
        //     res.on('error', (e) => {
        //         console.log(e.message);
        //     })
        //     res.on('end', () => {
        //         console.log('No more data in response.');
        //         // res.pipe(outFile)
        //         // outFile.close()
        //         win.loadURL(__dirname + '/rendertest.asar/index.html') //asarの中のアプリを開く
        //     });
        // })
        // // エラーがあれば扱う。
        // req.on('error', (e) => {
        //     console.error(`problem with request: ${e.message}`);
        // });
        // req.end();
        // req.pipe(outFile)

        // // ファイルをダウンロードする//未パッケージ環境なら上手く動作した
        request
        .get(url)
        .on('response', function (res) {
            splashWin = createSplash() //ローディング画面開く
            console.log('statusCode: ', res.statusCode);
            console.log('content-length: ', res.headers['content-length']);
        })
        .on('complete',(d)=>{
            splashWin.close() //ローディング画面閉じる
            outFile.close()
            win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く
        })
        .on('error',(e)=>{
            console.log('Error:',e); return
        })
        .pipe(outFile);
    // }else{
    //     // win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く
    //     win.loadURL(__dirname + '/render.asar/index.html') //asarの中のアプリを開く
    // }
}

const createSplash = () => {
    const splash = new BrowserWindow({
        width: 1042,
        minWidth: 1024,
        height: 810,
        minHeight: 768,
        icon: __dirname + '/app.png',
        webPreferences:{
            nodeIntegration:true
        },
        frame: false ,
        titleBarStyle: 'hidden'
    })

    splash.loadURL(__dirname + '/loading.html')

    return splash
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