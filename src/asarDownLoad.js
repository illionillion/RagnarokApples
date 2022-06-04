const { app } = require('electron')
const https = require('https')
const originalfs = require('original-fs');
const request = require('request');
const { createWindow, createSplash } = require('./createWindow.js');

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

exports.asarDownLoad = asarDownLoad