/**
 * Google DriveからシナリオデータのJSONを取得
 * @returns JSON
 */
export async function GetScenarioJson() {
    const req = await fetch('https://ji9xputuw8gwgczk2gnxzg.on.drv.tw/www.render.asar.server.com/scenario_data.json')
    console.log('Get JSON');
    return await req.json()
}