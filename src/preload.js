const { contextBridge, ipcRenderer } = require('electron');
// const { writeJson } = require('./writeFile');

require('dotenv').config({ path: __dirname + '/../.env' }) // .env読み込み

contextBridge.exposeInMainWorld('myAPI', {
    // .envの情報をプリロードスクリプトで読み込ませる
    URLS: {
        SCENARIO_DATA_JSON: process.env.SCENARIO_DATA_JSON,
        SCENARIO_AUDIO_DATA_JSON: process.env.SCENARIO_AUDIO_DATA_JSON,
        SCENARIO_MAP_DATA_JSON: process.env.SCENARIO_MAP_DATA_JSON,
        SCENARIO_ASSETS_DATA_JSON: process.env.SCENARIO_ASSETS_DATA_JSON
    }, 
    isPackaged: async () => await ipcRenderer.invoke('isPackaged'), // パッケージ状態か確認
    writeJson: async (data) => await ipcRenderer.invoke('writeJson', data),
    assetsDownLoad: async (data) => await ipcRenderer.invoke('assetsDownLoad', data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, argv) => callback(event, argv)), // メイン → レンダラー
    LOCAL_BUILD_DIR: process.env.LOCAL_BUILD_DIR,
    __dirname: __dirname,
})

console.log('preload!!');