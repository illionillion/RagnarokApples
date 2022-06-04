// モジュールロード
const { app, Menu, BrowserWindow } = require('electron')
const https = require('https')
const originalfs = require('original-fs');
const request = require('request');
// const fetch = require('node-fetch')

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
        show: false
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く

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
    splash.loadURL(__dirname + '/loading.html')
        
    return splash
}

/**
 * asarのダウンロード・置き換え
 */
const asarDownLoad = () => {
    // if (app.isPackaged) {//アプリがパッケージングされてる場合
        // ここで開く前にレンダラーのasarをサーバーから差し替え
        // URLを指定 
        const url = 'https://drive.google.com/uc?id=1mHfOd4seMjFuknv6hB1C55U9kMiw64sN&confirm=t';
        // const url = 'https://techcrunch.com/wp-content/uploads/2022/04/GettyImages-1240090042.jpg?w=1390&crop=1';
        
        // 出力ファイル名を指定
        const outFile = originalfs.createWriteStream(app.getPath('userData') + '/render.asar');
        let splashWin
        // const outFile = originalfs.createWriteStream('./rendertest.asar');
        // const outFile = originalfs.createWriteStream('./image.jpg');

        // request使わずにダウンロード

        // const download = (uri, filename) => {
        //     return new Promise((resolve, reject) =>
        //       https
        //         .request(uri, (res) => {
        //           res
        //             .pipe(filename)
        //             .on("close", resolve)
        //             .on("error", reject);
        //         })
        //         .end()
        //     );
        //   };
          
        //   download(
        //     url,
        //     outFile
        //   ).then(() => {
        //       console.log("done")
        //       win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く
        //     });
          
        // ダウンロード開始
        // var req = https.get(url, function (res) {

        //     // ダウンロードした内容をそのまま、ファイル書き出し。
        //     res.pipe(outFile);

        //     // 終わったらファイルストリームをクローズ。
        //     res.on('end', function () {
        //         outFile.close();
        //     }); 
        // });

        // // エラーがあれば扱う。
        // req.on('error', function (err) {
        //     console.log('Error: ', err); return;
        // });

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
            createWindow() 
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