const { contextBridge } = require('electron')

require('dotenv').config({ path: __dirname + '/../.env' }) // .env読み込み

contextBridge.exposeInMainWorld('myAPI', {
    // .envの情報をプリロードスクリプトで読み込ませる
    URLS: {
        SCENARIO_DATA_JSON: process.env.SCENARIO_DATA_JSON,
        SCENARIO_AUDIO_DATA_JSON: process.env.SCENARIO_AUDIO_DATA_JSON,
    }
})

console.log('preload!!');