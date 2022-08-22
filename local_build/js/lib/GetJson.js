import timer from "./timer.js"
// import localTextData from './json/scenario_data.json' assert { type: "json" }

/**
 * 乱数生成
 * @returns 乱数
 */
const rnd = () => {return Math.floor(Math.random() * 100)}

/**
 * 再帰で再実行した回数カウント
 */
let retryTime = 0

/**
 * DriveToWebからシナリオデータのJSONを取得
 * @param {string} url 
 * @returns {object} JSON
 */
export default async function GetJson(url) {

    // ファイル名切り出し
    const filename = url.split('/').pop()

    // 10回超えたらローカルのデータを渡す // これは最悪の場合
    if(retryTime > 10) {
        const res = await fetch(`./js/lib/json/${filename}`) // シナリオとオーディオでわけれるようにしたい
        return await res.json()
    }

    const random = rnd()

    const res = await fetch(url + '?id=' + random)
    // const res = await fetch(`./js/lib/json/${filename}`)
    
    if (res.status === 403) {
        console.log(`再取得 : ${url}`)
        retryTime++
        await timer(10 * retryTime) // 10ミリ秒 × 回数 で時間間隔を空ける
        return await GetJson (url) // 403エラーで失敗する時があるのでその時は再帰で再送信 // 基本2回目でいける
    }

    console.log(`Get JSON : ${url}`);
    return await res.json()

}