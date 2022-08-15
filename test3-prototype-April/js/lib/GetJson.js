/**
 * 乱数生成
 * @returns 乱数
 */
const rnd = () => {return Math.floor(Math.random() * 100)}

/**
 * Google DriveからシナリオデータのJSONを取得
 * @returns JSON
 */
export async function GetScenarioJson() {

    const random = rnd()

    const res = await fetch('https://ji9xputuw8gwgczk2gnxzg.on.drv.tw/www.render.asar.server.com/scenario_data.json?id=' + random)
    
    console.log('Get JSON Scenario!');
    return await res.json()

}

/**
 * Google DriveからシナリオオーディオデータのJSONを取得
 * @returns JSON
 */
export async function GetScenarioAudioJson() {
    // fetchが失敗した時の処理も考えておく
    const random = rnd()

    const res = await fetch('https://ji9xputuw8gwgczk2gnxzg.on.drv.tw/www.render.asar.server.com/scenario_audio_data.json?id=' + random)
    

    console.log('Get JSON Audio!');
    return await res.json()

}