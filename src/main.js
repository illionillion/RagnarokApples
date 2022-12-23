// モジュールロード
const { app, Menu, BrowserWindow, dialog, ipcMain } = require("electron");
const { asarDownLoad } = require("./asarDownLoad.js");
const { assetsDownLoad } = require("./assetsDownLoad.js");
const { createWindow, createSplash } = require("./createWindow.js");
const { writeJson } = require("./writeFile.js");
require("dotenv").config({ path: __dirname + "/../.env" }); // .env読み込み

/**
 * メインプロセス
 */
const mainProcess = async () => {
  // ダウンロードするかの確認
  const question = dialog.showMessageBoxSync({
    type: "question", // none/info/error/question/warning
    title: "確認",
    message: "ゲームデータをダウンロードしますか？",
    detail:
      "最新版でプレイすることができます。\n(初回起動時はダウンロードしてください)",
    buttons: ["する", "しない"],
    cancelId: -1, // Esc で閉じられたときの戻り値
  });

  if (question !== 0) {
    // 0(する)以外ならそのまま画面開く
    const mainWin = await createWindow(); // メインウィンドウ起動
    return; // 処理終了
  }

  const splashWin = await createSplash(); // ローディング画面起動

  // URLを指定
  const url = process.env.ASAR_URL;
  // 出力ファイル名を指定
  const outURL = app.getPath("userData") + "/renderer.asar";

  const download = await asarDownLoad(url, outURL, splashWin); // ダウンロード開始
  if (!download) {
    // 失敗時
    dialog.showErrorBox(
      "Connection Failed",
      "インターネットへの接続が失敗しました。インターネットに接続して、もう一度アプリを起動してください"
    );
  }

  // ここでダウンロードしてきたasarの中のJSONをダウンロードして最新にする

  const mainWin = await createWindow(); // メインウィンドウ起動
  splashWin.close(); //ローディング画面閉じる
};

//------------------------------------
// メニュー
//------------------------------------
// メニューを準備する
const template = Menu.buildFromTemplate([
  {
    label: "アプリ",
    submenu: [
      // { role:'close', label:'ウィンドウを閉じる' }
      { role: "togglefullscreen", label: "全画面切り替え" },
      { role: "quit", label: "アプリを終了" },
    ],
  },
  // {
  //   label: "編集",
  //   submenu: [
  //     { role:'undo',  label:'元に戻す' },
  //     { role:'redo',  label:'やり直す' },
  //     { type:'separator' },
  //     { role:'cut',   label:'切り取り' },
  //     { role:'copy',  label:'コピー' },
  //     { role:'paste', label:'貼り付け' },
  //   ]
  // }
]);

if (app.isPackaged) {
  //アプリがパッケージングされてる場合

  // メニューを適用する
  Menu.setApplicationMenu(template);
}

// 初期化が終了したらウィンドウをを新規に作成する
app.whenReady().then(mainProcess);

// 全てのウィンドウが閉じられた時の処理
app.on("window-all-closed", () => {
  // macOS以外はアプリを終了する
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// アプリがアクティブになった時
//(macOSはDocアイコンがクリックされたとき)
app.on("activate", () => {
  // ウィンドウがすべて閉じられている場合は新しく開く
  if (BrowserWindow.getAllWindows().length === 0) {
    // Macにて信号赤が押されてからアイコンクリックされた時にダウンロードから始める
    createWindow();
  }
});

// レンダラーにapp.isPackagedを渡す
ipcMain.handle("isPackaged", () => {
  return app.isPackaged;
});
// レンダラーからfetchで取得したJSONをファイルに書き出させる（開発環境のみ）
ipcMain.handle("writeJson", (event, data) => {
  return writeJson(data.filename, data.json);
});

ipcMain.handle("assetsDownLoad", async (event, data) => {
  console.log(data);
  return await assetsDownLoad(data.filename, data.type, data.link);
});
const path = app.getPath("userData") + "/asstes/";
ipcMain.handle("getAssetsPath", async (event, data) => {
  console.log(data);
  return path;
});
