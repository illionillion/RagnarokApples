const https = require('https')
const originalfs = require('original-fs');

/**
 * http.get
 * asarのダウンロード・置き換え
 * @param {*} url ダウンロードするファイルのURL
 * @param {*} outURL 出力するファイルのURL
 */
const asarDownLoad = async (url, outURL) => {

    try {
        return await new Promise((resolve, reject) => {

            const req = https.get(url, async (res) => {

                console.log(res.statusCode); // 303が返ってくる
                console.log(res.statusMessage);

                // 303だった場合locationを見てそこから取得
                if (res.statusCode === 303) {
                    await asarDownLoad(res.headers.location, outURL); // 再帰
                    resolve(true);
                    return;
                }
                // ダウンロードした内容をそのまま、ファイル書き出し。
                const outFile = originalfs.createWriteStream(outURL);
                res.pipe(outFile);

                // 終わったらファイルストリームをクローズ。
                res.on('end', function () {
                    console.log('end');
                    outFile.close();
                    resolve(true);
                });
            });

            // エラーがあれば扱う。
            req.on('error', function (err) {
                console.log('Error: ', err);
                reject(false);
            });
        });
    } catch (err_1) {
        console.log(err_1);
        return err_1;
    }

}

exports.asarDownLoad = asarDownLoad