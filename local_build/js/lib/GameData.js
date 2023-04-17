import ScenarioPlayer from "./ScenarioPlayer.js";
import { closeConfirm, openConfirm } from "./confirm.js";
import { CreateMap } from "./map.js";
import toDarking from "./toDarking.js";

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
};

/**
 * データの保存
 * @param {string} key
 * @param {string} value
 */
const saveData = async (key, value) => {
  localStorage.setItem(key, value);
};

/**
 * データの呼び出し
 * @param {string} key
 * @returns
 */
const loadData = async (key) => {
  return localStorage.getItem(key) || "";
};

/**
 * データの削除
 * @param {string} key
 */
const removeData = async (key) => {
  localStorage.removeItem(key);
};

/**
 * データのコピー
 * @param {string} from
 * @param {string} to
 */
const copyData = async (from, to) => {
  await saveData(to, await loadData(from));
};

/**
 * タイトル設定
 * @param {string} title
 */
const setGameDataTitle = (title) => {
  document.getElementById("game-data-title").innerHTML = title;
};

/**
 * セーブ画面起動
 * @param {"save" | "load" | "copy" | "move"} type
 * @param {number} op
 * @param {"save" | "load"} prevType
 * @returns
 */
export const openGameDataScreen = async (type, op = -1, prevType = "") => {
  if (!type || type === "") return;

  setGameDataTitle(
    // `${type === "load" ? "ロード" : "セーブ"}するデータを選択してください。`
    `${(() => {
      switch (type) {
        case "load":
          return "ロードする";
        case "save":
          return "セーブする";
        case "copy":
          return "コピーする";
        case "move":
          return "入れ替える";
        default:
          return "";
      }
    })()}データを選択してください。`
  );

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

    const is_json_check = is_json(data);

    if (data !== "" && is_json_check) {
      const json = JSON.parse(data); // ここでJSONに変換できなくてエラーとか起こりそう
      // データがあった場合
      const name = json["charName"];
      const nowDate = json["nowDate"];
      item.querySelector(".game-data-content").innerHTML = `${name} ${nowDate}`;
      if (op >= 0) {
        item.querySelector(".copy").classList.add("disabled");
        item.querySelector(".reorder").classList.add("disabled");
        item.querySelector(".delete").classList.add("disabled");
      }
    } else {
      // データがない場合
      item.querySelector(".game-data-content").innerHTML = `データがありません`;
      item.querySelector(".copy").classList.add("default");
      item.querySelector(".reorder").classList.add("default");
      item.querySelector(".delete").classList.add("default");

      // データの削除
      await removeData("data-" + i);
    }
    list.appendChild(item);
    const listItem = list.querySelectorAll(".game-data-item")[i - 1];
    const deleteButton = listItem.querySelector(".delete");
    const copyButton = listItem.querySelector(".copy");
    const preventFlag = data === "" || !is_json_check;

    listItem.addEventListener("click", () =>
      onClickItem(preventFlag, type, i, op, prevType)
    );
    if (op === -1) {
      deleteButton.addEventListener("click", (e) =>
        onClickDelete(e, preventFlag, type, i)
      );
      copyButton.addEventListener("click", (e) =>
        onClickCopy(e, preventFlag, type, i)
      );
    }
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
 * セーブ | ロード | コピー しますか？「はい」
 * @param {"save" | "load" | "copy" | "move"} type
 * @param {number} no
 * @param {number} op
 * @param {"save" | "load"} prevType
 */
const dataConformYes = async (type, no, op, prevType) => {
  switch (type) {
    case "save":
      await saveData("data-" + no, JSON.stringify(gameData));
      closeConfirm();
      openGameDataScreen("save");
      break;
    case "load":
      const data = JSON.parse(await loadData("data-" + no));
      Object.keys(gameData).forEach((key) => {
        if (key === "nowPart") {
          gameData[key] = data["prevPart"];
        } else {
          gameData[key] = data[key];
        }
      });
      await toDarking(async (e) => {
        closeConfirm();
        closeGameDataScreen();
        await CreateMap(gameData);
        ScenarioPlayer.screenReset();
      }, gameData);
      break;
    case "copy":
      // コピー
      await copyData("data-" + op, "data-" + no);
      closeConfirm();
      openGameDataScreen(prevType); // ここでcopyから前のsave || loadに戻したい

      break;
    case "move":
      // 入れ替え

      break;

    default:
      break;
  }
};

/**
 *  アイテムをクリックした時（セーブ・ロードの確認）
 * @param {boolean} preventFlag
 * @param {"save" | "load" | "copy" | "move"} type
 * @param {number} i
 * @param {number} op
 * @param {"save" | "load"} prevType
 */
const onClickItem = (preventFlag, type, i, op, prevType) => {
  if (preventFlag && type === "load") return;
  openConfirm(
    `${(() => {
      switch (type) {
        case "save":
          return "セーブし";
        case "load":
          return "ロードし";
        case "copy":
          return `データ${op}をデータ${i}にコピーし`;
        case "move":
          return `データ${op}をデータ${i}に入れ替え`;

        default:
          return "";
      }
    })()}ますか？`
  );
  const execYes = () => {
    dataConformYes(type, i, op, prevType);
    removeEvent();
  };
  const execNo = () => {
    closeConfirm();
    removeEvent();
  };
  const removeEvent = () => {
    yesButton.removeEventListener("click", execYes);
    noButton.removeEventListener("click", execNo);
  };
  yesButton.addEventListener("click", execYes);
  noButton.addEventListener("click", execNo);
};

/**
 * 削除ボタン押した時
 * @param {Event} e
 * @param {boolean} preventFlag
 * @param {"save" | "load"} type
 * @param {number} i
 */
const onClickDelete = (e, preventFlag, type, i) => {
  if (preventFlag) return;
  e.stopPropagation(); // この順番でいい
  openConfirm(`データ${i}を削除しますか？`);
  const execYes = async () => {
    await removeData("data-" + i);
    closeConfirm();
    openGameDataScreen(type);
    removeEvent();
  };
  const execNo = () => {
    closeConfirm();
    removeEvent();
  };
  const removeEvent = () => {
    yesButton.removeEventListener("click", execYes);
    noButton.removeEventListener("click", execNo);
  };
  yesButton.addEventListener("click", execYes);
  noButton.addEventListener("click", execNo);
};

/**
 * コピーボタン押した時
 * @param {Event} e
 * @param {boolean} preventFlag
 * @param {"save" | "load" | "copy" | "move"} type
 * @param {number} i
 */
const onClickCopy = (e, preventFlag, type, i) => {
  if (preventFlag) return;
  e.stopPropagation(); // この順番でいい

  openGameDataScreen("copy", i, type);

  // ここで戻るボタンのイベント変更
};

/**
 * JSONか判定
 * @param {string} str
 * @returns {boolean} `true`: JSONである, `false`: JSONでない
 */
export const is_json = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
