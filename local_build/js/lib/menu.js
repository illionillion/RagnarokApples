import { openGameDataScreen } from './GameData.js';
import { TitleOpen } from './title.js';

let gameData = {};

const menuFrame = document.getElementById('menu-frame');
const menuOpenButton = document.getElementById('map-menu-btn');
const menuCloseButton = document.getElementById('menu-close-button');
/**
 * メニュー初期化
 */
export const initMenu = (gameState) => {
  // 初回のみ（GameData.jsから呼ばれる場合は実行せずにgameDataの設定だけ行う）
  if (Object.keys(gameData).length === 0) {
    menuOpenButton.addEventListener('click', openMenuScreen);
    menuCloseButton.addEventListener('click', closeMenuScreen);
    // ログ以外はここから発火
    menuFrame
      .querySelector('#menu-list li[data-menubutton="load"]')
      .addEventListener('click', () => openGameDataScreen('load'));
    menuFrame
      .querySelector('#menu-list li[data-menubutton="save"]')
      .addEventListener('click', () => openGameDataScreen('save'));
    menuFrame
      .querySelector('#menu-list li[data-menubutton="title"]')
      .addEventListener('click', () => {
        // マップ画面も元に戻す必要あり
        document
          .querySelectorAll('.map-touch')
          .forEach((ele) => ele.classList.add('none'));
        closeMenuScreen();
        TitleOpen();
      });
  }

  gameData = gameState;
};

/**
 * メニュー起動
 */
export const openMenuScreen = () => {
  menuFrame.classList.remove('hide');
  if (gameData.eventState === 'ScenarioPlayer') {
    menuFrame
      .querySelector('#menu-list li[data-menubutton="place"]')
      .classList.remove('none');
    menuFrame
      .querySelector('#menu-list li[data-menubutton="log"]')
      .classList.remove('none');
  } else {
    menuFrame
      .querySelector('#menu-list li[data-menubutton="place"]')
      .classList.add('none');
    menuFrame
      .querySelector('#menu-list li[data-menubutton="log"]')
      .classList.add('none');
  }
  setMenuDay();
};

/**
 * メニュー終了
 */
export const closeMenuScreen = () => {
  menuFrame.classList.add('hide');
};

const setMenuDay = () => {
  document.querySelector('#menu-list .day').textContent = gameData.nowDate;
  document.querySelector('#menu-list .day').dataset.day = gameData.nowDate;
  document.querySelector('#menu-list .place').textContent = gameData.nowPlace;
  document.querySelector('#menu-list .place').dataset.place = gameData.nowPlace;
};
