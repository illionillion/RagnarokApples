/**
 * 乱数生成
 * @returns 乱数
 */
const rnd = () => {return Math.floor(Math.random() * 100)}

/**
 * Google DriveからシナリオデータのJSONを取得
 * @param {string} url 
 * @returns 
 */
export default async function GetJson(url) {
    try {
        
        const random = rnd()
    
        const res = await fetch(url + '?id=' + random)
        
        console.log(`Get JSON : ${url}`);
        return await res.json()

    } catch (error) {
        
        // console.log(error);
        console.log(`再取得 : ${url}`);
        return await GetJson (url) // 403エラーで失敗する時があるのでその時は再帰で再送信

    }


}