const { app } = require('electron')
const https = require('https')
const originalfs = require('original-fs');
const { createWindow, createSplash } = require('./createWindow.js');

/**
 * asarのダウンロード・置き換え
 */
const asarDownLoad = () => {
    // if (app.isPackaged) {//アプリがパッケージングされてる場合
        // ここで開く前にレンダラーのasarをサーバーから差し替え
        // URLを指定 
        const url = 'https://drive.google.com/uc?id=1mHfOd4seMjFuknv6hB1C55U9kMiw64sN&confirm=t';
        
        // 出力ファイル名を指定
        const outURL = app.getPath('userData') + '/render.asar'

        // request使わずにダウンロード
       
        // // ダウンロード開始
        get(url, outURL)

    // }else{
    //     // win.loadURL(app.getPath('userData') + '/render.asar/index.html') //asarの中のアプリを開く
    //     win.loadURL(__dirname + '/render.asar/index.html') //asarの中のアプリを開く
    // }
}

/**
 * http.get
 * @param {*} url ダウンロードするファイルのURL
 * @param {*} outURL 出力するファイルのURL
 */
// const get = (url, outURL, splashWin) => {
let splashWin
const get = (url, outURL) => {
    const req = https.get(url, (res) => {
        
        splashWin = !splashWin || createSplash() //ローディング画面開く
        console.log(res.statusCode); // 303が返ってくる
        console.log(res.statusMessage);
        
        // 303だった場合locationを見てそこから取得
        if (res.statusCode === 303) {
            get(res.headers.location, outURL) // 再帰
            return
        }
        // ダウンロードした内容をそのまま、ファイル書き出し。
        const outFile = originalfs.createWriteStream(outURL);
        res.pipe(outFile);

        // 終わったらファイルストリームをクローズ。
        res.on('end', function () {
            console.log('end');
            outFile.close();
            createWindow()
            setTimeout(() => {
                splashWin.close() //ローディング画面閉じる
            }, 2000);
            return
        }); 
    });

    // エラーがあれば扱う。
    req.on('error', function (err) {
        console.log('Error: ', err);
        return;
    });

}

exports.asarDownLoad = asarDownLoad