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
export const initGameData = () => {
  document.getElementById('game-data-close').addEventListener('click', closeGameDataScreen)
}