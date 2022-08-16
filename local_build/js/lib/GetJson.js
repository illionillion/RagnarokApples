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

    const random = rnd()

    const res = await fetch(url + '?id=' + random)
    
    console.log('Get JSON !');
    return await res.json()

}