import { CreateMap } from './map.js';
import toDarking from './toDarking.js';

let gameData = {};

export const TitleInit = (gameState) => {
  if (Object.keys(gameData).length > 0) {
    gameData = gameState;
    return;
  }
  gameData = gameState;

  let index = 0;

  /**
   * @param {KeyboardEvent} e
   */
  const keyDownAllow = (e) => {
    if (e.code == 'KeyW' || e.code == 'ArrowUp') {
      if (index > 0) index -= 1;
      // console.log(`Up`);
    } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
      // console.log(`Down`);
      if (index < 4) index += 1;
    } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
      // console.log(`Left`);
    } else if (e.code == 'KeyD' || e.code == 'ArrowRight') {
      // console.log(`Right`);
    }

    setAllowCursor();
  };

  /**
   * 十字キーカーソルセット
   */
  const setAllowCursor = () => {
    document
      .querySelectorAll('#title-list ul li')
      [index].classList.add('on-cursor');
    for (let i = 0; i < 5; i++) {
      if (i === index) continue;
      document
        .querySelectorAll('#title-list ul li')
        [i].classList.remove('on-cursor');
    }
  };

  /**
   * @param {number} i
   * @param {string} nav
   */
  const clickHandler = async (i, nav) => {
    // 既に同じだった場合
    if (index === i) {
      // console.log('選択', nav);
      switch (nav) {
        case 'start':
          // 以下からがマップへ切り替え用のコード
          document
            .querySelectorAll('#mapCharacterList ul li img')
            .forEach((ele) => {
              ele.addEventListener('error', () => {
                ele.src = 'images/map-screen/map3-default-icon.png';
              });
            });

          await toDarking(async () => {
            await CreateMap(gameData);
            TitleClose();
          }, gameData);
          break;
        case 'continue':
          break;
        case 'load':
          break;
        case 'gallery':
          break;
        case 'setting':
          break;

        default:
          break;
      }
    } else {
      index = i;
      setAllowCursor();
    }
  };

  window.addEventListener('keydown', keyDownAllow);

  document.addEventListener('contextmenu', () => {
    return false;
  });
  for (let i = 0; i < 5; i++) {
    document
      .querySelectorAll('#title-list ul li')
      [i].addEventListener('click', (e) => {
        clickHandler(i, e.target.dataset.nav);
      });
  }

  setAllowCursor();
};


export const TitleClose = () => {
  document.getElementById('title-screen').classList.add('none');
};

export const TitleOpen = () => {
  document.getElementById('title-screen').classList.rmeove('none');
};