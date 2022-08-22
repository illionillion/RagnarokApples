require('dotenv').config({ path: __dirname + '/../.env' }) // .env読み込み
const fs = require('fs')

/**
 * ファイル書き出し
 * @param {string} path ファイルパス
 * @param {string} txt テキスト
 */
const writeFile = (path, txt) => {
    fs.writeFileSync(path, txt)
}

/**
 * ファイル書き出し
 * @param {string} fn ファイル名
 * @param {object} json JSON
 */
const writeJson = (fn, json) => {
    fs.writeFileSync(`${__dirname}/../${process.env.LOCAL_BUILD_DIR}/js/lib/json/${fn}`, JSON.stringify(json))
}

exports.writeFile = writeFile
exports.writeJson = writeJson