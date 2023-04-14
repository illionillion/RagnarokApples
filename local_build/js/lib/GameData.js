import { closeConfirm, openConfirm } from "./confirm.js";

/**
 * データ総数
 * @type {number}
 */
const dataLength = 20;
const yesButton = document.querySelector("#confirm-dialog-buttons .btn-yes");
const noButton = document.querySelector("#confirm-dialog-buttons .btn-no");
const closeButton = document.getElementById("game-data-close");
/**
 * ゲームのデータを参照渡しで保存
 */
let gameData = {};

/**
 * データの同期
 * @param {Object} gameState 
 */
export const initGameData = (gameState) => {
  gameData = gameState;
}

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
export const openGameDataScreen = async (type) => {
  if (!type || type === "") return;

  console.log(gameData);

  document.getElementById("game-data-title").innerHTML = `${
    type === "load" ? "ロード" : "セーブ"
  }するデータを選択してください。`;

  const template = document.getElementById("game-data-item-template");
  const list = document.getElementById("game-data-list");
  list.innerHTML = "";
  for (let i = 1; i <= dataLength; i++) {
    const data = await loadData("data-" + i);
    /**
     * @type {HTMLElement}
     */
    const item = template.content.cloneNode(true);
    item.querySelector(".game-data-name").innerHTML = `データ${i}`;
    if (data !== "") {
      // データがあった場合
      item.querySelector(".game-data-content").innerHTML = `タウ　n日目　⚪︎⚪︎`;
      item.querySelector(".game-data-copy").classList.remove("default");
      item.querySelector(".game-data-reorder").classList.remove("default");
      item.querySelector(".game-data-delete").classList.remove("default");
    } else {
      // データがない場合
      item.querySelector(".game-data-content").innerHTML = `データがありません`;
      item.querySelector(".game-data-copy").classList.add("default");
      item.querySelector(".game-data-reorder").classList.add("default");
      item.querySelector(".game-data-delete").classList.add("default");
    }
    list.appendChild(item);
    list
      .querySelectorAll(".game-data-item")
      [i - 1].addEventListener("click", () => {
        openConfirm(`${type === "load" ? "ロード" : "セーブ"}しますか？`);
        const execYes = () => {
          dataConformYes(type, i);
          removeEvent();
        };
        const execNo = () => {
          dataConformNo();
          removeEvent();
        };
        const removeEvent = () => {
          yesButton.removeEventListener("click", execYes);
          noButton.removeEventListener("click", execNo);  
        }
        yesButton.addEventListener("click", execYes);
        noButton.addEventListener("click", execNo);
      });
  }

  closeButton.addEventListener("click", closeGameDataScreen);
  document.getElementById("game-data-screen").classList.remove("none");
};

/**
 * 閉じる
 */
export const closeGameDataScreen = () => {
  document.getElementById("game-data-screen").classList.add("none");
  closeButton.removeEventListener("click", closeGameDataScreen);
};

/**
 * セーブしますか？「はい」
 * @param {"save" | "load"} type
 * @param {number} no
 */
const dataConformYes = async (type, no) => {
  if (type === "save") {
    await saveData("data-" + no, JSON.stringify(gameData));
    // await saveData("data-" + no, no);
  }
  if (type === "load") {
    console.log(await loadData("data-" + no));
  }
  closeConfirm();
};

/**
 * セーブしますか？「いいえ」
 * 
 */
const dataConformNo = () => {
  closeConfirm();
};
