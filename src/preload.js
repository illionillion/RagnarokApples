const { contextBridge, ipcRenderer, app } = require('electron');
const resize = require('image-map-resizer');
// const { writeJson } = require('./writeFile');
// console.log('resize', resize);

require('dotenv').config({ path: __dirname + '/../.env' }); // .env読み込み

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
  getAssetsPath: async () => await ipcRenderer.invoke('getAssetsPath'),
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, argv) => callback(event, argv)), // メイン → レンダラー
  LOCAL_BUILD_DIR: process.env.LOCAL_BUILD_DIR,
  __dirname,
  imageMapResize: resize
});

console.log('preload!!');
