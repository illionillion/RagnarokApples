const dataLength = 20;

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
    document.getElementById('game-data-title').innerHTML = 'セーブするデータを選択してください。'
  }
  if (type === "load") {
    document.getElementById('game-data-title').innerHTML = 'ロードするデータを選択してください。'
  }
  document.getElementById('game-data-screen').classList.remove('none');

};

/**
 * 閉じる
 */
export const closeGameDataScreen = () => {
  document.getElementById('game-data-screen').classList.add('none');
}

/**
 * 初期化
 */
export const initGameData = async () => {
  document.getElementById('game-data-close').addEventListener('click', closeGameDataScreen)
  const template = document.getElementById("game-data-item-template");
  const list = document.getElementById("game-data-list");
  for (let i = 1; i <= dataLength; i++) {
    const data = await loadData(i);
    const item = template.content.cloneNode(true)
    if (data !== "") {
      // データがあった場合
    } else {
      // データがない場合
      item.querySelector(".game-data-name").innerHTML = `データ${i}`;
      item.querySelector(".game-data-content").innerHTML = `データがありません`;
    }
    list.appendChild(item);
  }
}