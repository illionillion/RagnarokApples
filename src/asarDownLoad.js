const { app } = require('electron')
const http = require('http')
const https = require('https')
const originalfs = require('original-fs');
const request = require('request');
const { createWindow, createSplash } = require('./createWindow.js');
// const fetch = require('node-fetch');

/**
 * asarのダウンロード・置き換え
 */
const asarDownLoad = () => {
    // if (app.isPackaged) {//アプリがパッケージングされてる場合
        // ここで開く前にレンダラーのasarをサーバーから差し替え
        // URLを指定 
        const url = 'https://drive.google.com/uc?id=1mHfOd4seMjFuknv6hB1C55U9kMiw64sN&confirm=t';
        const urlTest = 'http://or0e9abi5m.php.xdomain.jp/asartest/render.asar';
        // const urlLocal = 'http://127.0.0.1:8080/render.asar'; //こっちならhttp行ける
        const imageUrl = 'https://techcrunch.com/wp-content/uploads/2022/04/GettyImages-1240090042.jpg?w=1390&crop=1';
        
        // 出力ファイル名を指定
        const outFile = originalfs.createWriteStream(app.getPath('userData') + '/render.asar');
        let splashWin
        const outTestFile = originalfs.createWriteStream('./rendertest.asar');
        const outImageFile = originalfs.createWriteStream('./image.jpg');

        // request使わずにダウンロード
        /*
        1.googledriveでDriveToWebでホスティングしている場合はrequestでできる
        2.googledriveでなかったらhttp/fsでできる
        ただし、無料レンタルサーバーだとasarをアップロードできない
        */
        // ダウンロード開始
        const req = https.get(url, function (res) {

            console.log(res.statusCode); // 303が返ってくる
            console.log(res.statusMessage);
            console.log(res.headers);
            // ダウンロードした内容をそのまま、ファイル書き出し。
            res.pipe(outTestFile);

            // 終わったらファイルストリームをクローズ。
            res.on('end', function () {
                outTestFile.close();
            }); 
        });

        // エラーがあれば扱う。
        req.on('error', function (err) {
            console.log('Error: ', err); return;
        });

        // https
        // .request(url, (res) => {
        //     console.log(res.statusCode);//303が出る
        //     res
        //     .pipe(outTestFile)
        //     .on("close", () => {})
        //     .on("error", () => {});
        // })
        // .end()

        // // ファイルをダウンロードする
        request
        .get(url)
        .on('response', function (res) {
            splashWin = createSplash() //ローディング画面開く
            console.log('statusCode: ', res.statusCode);
            console.log('content-length: ', res.headers['content-length']);
        })
        .on('complete',()=>{
            outFile.close()
            console.log('ended');
            createWindow()
            setTimeout(() => {
                splashWin.close() //ローディング画面閉じる
            }, 2000);
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

exports.asarDownLoad = asarDownLoad