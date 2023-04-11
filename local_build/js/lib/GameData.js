import { closeConfirm, openConfirm } from "./confirm.js";

const dataLength = 20;
const yesButton = document.querySelector("#confirm-dialog-buttons .btn-yes");
const noButton = document.querySelector("#confirm-dialog-buttons .btn-no");

/**
 * データの保存
 * @param {string} key
 * @param {string} value
 */
export const saveData = async (key, value) => {
  localStorage.setItem(key, value);
};

/**
 * データの呼び出し
 * @param {string} key
 * @returns
 */
export const loadData = async (key) => {
  return localStorage.getItem(key) || "";
};

/**
 * セーブ画面起動
 * @param {"save" | "load"} type
 * @returns
 */
export const openGameDataScreen = (type) => {
  if (!type || type === "") return;
  if (type === "save") {
    document.getElementById("game-data-title").innerHTML =
      "セーブするデータを選択してください。";
  }
  if (type === "load") {
    document.getElementById("game-data-title").innerHTML =
      "ロードするデータを選択してください。";
  }
  document.getElementById("game-data-screen").classList.remove("none");
};

/**
 * 閉じる
 */
export const closeGameDataScreen = () => {
  document.getElementById("game-data-screen").classList.add("none");
};

// セーブしますか？「はい」
const dataConformYes = () => {
  closeConfirm();
};

// セーブしますか？「いいえ」
const dataConformNo = () => {
  closeConfirm();
};

/**
 * 初期化
 */
export const initGameData = async () => {
  document
    .getElementById("game-data-close")
    .addEventListener("click", closeGameDataScreen);
  const template = document.getElementById("game-data-item-template");
  const list = document.getElementById("game-data-list");
  for (let i = 1; i <= dataLength; i++) {
    const data = await loadData(i);
    const item = template.content.cloneNode(true);
    if (data !== "") {
      // データがあった場合
    } else {
      // データがない場合
      item.querySelector(".game-data-name").innerHTML = `データ${i}`;
      item.querySelector(".game-data-content").innerHTML = `データがありません`;
      item.querySelector(".game-data-copy").classList.add("default");
      item.querySelector(".game-data-reorder").classList.add("default");
      item.querySelector(".game-data-delete").classList.add("default");
    }
    list.appendChild(item);
    console.log();
    list
      .querySelectorAll(".game-data-item")
      [i - 1].addEventListener("click", () => {
        openConfirm("セーブしますか？");
        yesButton.addEventListener("click", dataConformYes);
        noButton.addEventListener("click", dataConformNo);
      });
  }
};
