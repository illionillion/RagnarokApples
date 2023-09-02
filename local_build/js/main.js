'use strict';
import FrameSizing from './lib/FrameSizing.js';
import { closeGameDataScreen, initGameData } from './lib/GameData.js';
import { CreateMap } from './lib/map.js';
import { initMenu } from './lib/menu.js';
import { TitleInit } from './lib/title.js';
import toDarking from './lib/toDarking.js';

(function () {
  const gameState = {
    charName: 'タウ',
    nowPart: 'init', // マップのinitを取得する
    nextPart: 'init',
    FloatCheck: true,
    nowDate: '0日目',
    nowPlace: undefined,
    eventState: 'title',
    autoPlayingFlag: false, // いらない
    TextPlayer: undefined, // いらない
    screenDarking: false, // 暗転中か
    menuFlag: false
  };

  window.addEventListener('resize', FrameSizing);

  window.addEventListener('load', async (e) => {
    document.addEventListener('contextmenu', () => {
      return false;
    });

    FrameSizing();
    window?.myAPI?.imageMapResize(); // イメージマップのリサイズ

    initGameData(gameState);
    initMenu(gameState);
    closeGameDataScreen();

    TitleInit()
    // 伝搬チェック用
    // document.querySelectorAll('*').forEach(element => {
    //     element.addEventListener('click',e=>{
    //         console.log(e.target)
    //     })
    // });


    // 以下からがマップへ切り替え用のコード
    document.querySelectorAll(
      '#mapCharacterList ul li img'
    ).forEach(ele => {
      ele.addEventListener('error', () => {
        ele.src = 'images/map-screen/map3-default-icon.png';
      });
    });

    await toDarking(async (e) => {
      await CreateMap(gameState);
      // マップ画面遷移系
      const FloatCheck = document.getElementById('FloatCheck');
      const TextFloat = document.getElementById('mapTextFloat');
      const TextCover = document.getElementById('mapTextCover');
      TextCover.addEventListener('click', () => {
        // 1から2へ遷移
        TextCover.classList.add('none');
        FloatCheck.classList.remove('op0');
        TextFloat.classList.remove('op0');
      });

      // ここのON/OFFいらない？
      FloatCheck.addEventListener('click', () => {
        // 2と3の切り替え
        if (!TextCover.classList.contains('none')) return;
        if (gameState.FloatCheck) {
          gameState.FloatCheck = false;
          FloatCheck.children[0].innerHTML = 'OFF';
          TextFloat.classList.add('op0');
        } else {
          gameState.FloatCheck = true;
          FloatCheck.children[0].innerHTML = 'ON';
          TextFloat.classList.remove('op0');
        }
      });

      document.getElementById('menu-frame').addEventListener('click', (e) => {
        // console.log('click!');
        e.stopPropagation();
      });
    }, gameState);
  });
})();
