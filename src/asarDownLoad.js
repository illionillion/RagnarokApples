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
        const imageUrl = 'https://techcrunch.com/wp-content/uploads/2022/04/GettyImages-1240090042.jpg?w=1390&crop=1';
        
        // 出力ファイル名を指定
        const outFile = originalfs.createWriteStream(app.getPath('userData') + '/render.asar');
        let splashWin
        const outTestFile = originalfs.createWriteStream('./rendertest.asar');
        const outImageFile = originalfs.createWriteStream('./image.jpg');

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

        // リンク先は .mp3 ファイル
        var options = {
            // method : 'GET',
            // host   : 'm.friendfeed-media.com',
            // port   : '80',
            path   : url
        };


        var req = https.request(options);
        req.end();

        req.on('response', function (res) {
            onResponseCallback(res, options);
        });
        req.on('error', showError);


        function onResponseCallback (res, opts) {
            var ext    = (res.headers['content-type'].split(/\//))[1];
            var target = [ (opts['path'].split(/\?/))[0].replace(/^\//,''), ext ].join('.');
            var writeStream = fs.createWriteStream(target);
            writeStream.on('error', function (exception) {
                throw exception;
            });
            writeStream.on('close', function () {
                console.log('! Called "close" on writeStream');
            });

            //res.setEncoding('utf-8'); バイナリを扱うので指定しないと、 Buffer に
            res.on('data', function (chunk) {
                writeStream.write(chunk); 
            });
            res.on('close', showError);
            res.on('end', function () {
                writeStream.end();
                console.log(target);
            });
        }


        function showError (e) {
            console.log([ e.name, e.messsage ].join(': '));
            return undefined;
        }

          
        // ダウンロード開始
        // var req = https.get(url, function (res) {
        // var req = https.get(imageUrl, function (res) {
        //     res.on('data', data => {
        //         // 画像の場合は実行される
        //         // console.log(data);
        //     } )
        //     // ダウンロードした内容をそのまま、ファイル書き出し。
        //     // res.pipe(outTestFile);
        //     res.pipe(outImageFile);

        //     // 終わったらファイルストリームをクローズ。
        //     res.on('end', function () {
        //         // outTestFile.close();
        //         outImageFile.close();
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