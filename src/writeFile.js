require('dotenv').config({ path: __dirname + '/../.env' }) // .env読み込み
const { app } = require('electron');
const fs = require('fs');

/**
 * ファイル書き出し
 * @param {string} path ファイルパス
 * @param {string} txt テキスト
 */
const writeFile = (path, txt) => {
    fs.writeFileSync(path, txt)
    console.log('書き出し完了');
}

/**
 * ファイル書き出し
 * @param {string} fn ファイル名
 * @param {object} json JSON
 */
const writeJson = (fn, json) => {
    // fs.writeFileSync(`${__dirname}/../${process.env.LOCAL_BUILD_DIR}/js/lib/json/${fn}`, JSON.stringify(json))

    const build_path = app.getPath('userData') + '/renderer.asar'
    // const build_path = app.getPath('userData') + '/json'
    console.log(build_path);
    console.log(__dirname);

    // if (app.isPackaged) {
    //     fs.writeFileSync(build_path + '/js/lib/json/' + fn, JSON.stringify(json)) // asar内の書き換えはできない？？
    // } else {
    //     fs.writeFileSync(build_path + '/js/lib/json/' + fn, JSON.stringify(json))
    //     fs.writeFileSync(__dirname + '/../' + process.env.LOCAL_BUILD_DIR + '/js/lib/json/' + fn, JSON.stringify(json))
    // }
    if (!app.isPackaged) { // ローカル
            fs.writeFileSync(__dirname + '/../' + process.env.LOCAL_BUILD_DIR + '/js/lib/json/' + fn, JSON.stringify(json))
    }
    // // レンダラーのasarの外(asarと同階層)にJSONを書き出したい
    // if (!fs.existsSync(__dirname + '/../json/')) { 
    //     // フォルダが存在しない場合、フォルダ作成
    //     fs.mkdirSync(__dirname + '/../json/');        
    // }
    // fs.writeFileSync(__dirname + '/../json/' + fn, JSON.stringify(json))


    console.log('書き出し完了');
}

exports.writeFile = writeFile
exports.writeJson = writeJson