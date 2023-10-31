import { closeConfirm, openConfirm } from './confirm.js';
import { convert2Dakuon } from './convert2Dakuon.js';
import { convert2HanDakuon } from './convert2HanDakuon.js';
import { convert2Komoji } from './convert2Komoji.js';
import { CreateMap } from './map.js';
import toDarking from './toDarking.js';

let input = document.querySelectorAll('.keyboard-rows > input');
let named = document.getElementById('keyboard-name');
let names = [];
let Count = 0;
const maxCount = 6;
let initFlag = false;
let gameData = {};

export const initKeyboard = (gameState) => {
  names = Array.from(gameState.charName);
  Count = names.length;
  gameData = gameState;
  update();

  if (initFlag) return;
  document.getElementById('keyboard-screen').classList.remove('none');
  input.forEach(function (ele) {
    ele.addEventListener('click', function () {
      if (ele.value === '削除') {
        console.log('削除');
        deleteBtn();
        return;
      }
      if (ele.value === '小字') {
        komojiBtn();
        return;
      }
      if (ele.value === '全削除') {
        allDeleteBtn();
        return;
      }
      if (ele.value === '゛') {
        dakuBtn();
        return;
      }
      if (ele.value === '゜') {
        HandakuBtn();
        return;
      }
      if (ele.value === '決定') {
        confirmBtn();
        return;
      }
      if (Count < maxCount) {
        typed(ele);
      }
    });
  });
  for (let i = 0; i < input.length; i++) {
    input[i].addEventListener('click', function () {
      this.blur();
    });
  }
  initFlag = true;
};

/**
 * 更新
 */
function update() {
  named.innerHTML = '';
  console.log([...names, ...new Array(maxCount - names.length).fill('\u3000')]);
  [...names, ...new Array(maxCount - names.length).fill('\u3000')].forEach(function (name) {
    const spanele = document.createElement('span');
    spanele.innerHTML = name;
    named.appendChild(spanele);
  });
}

function typed(ele) {
  names[Count] = ele.value;
  update();

  console.log(named);
  Count++;
  console.log(names);
}

// 削除ボタン
function deleteBtn() {
  if (Count !== 0) {
    // この条件式がないと配列が空の時に、削除ボタンを押すと添字がマイナスになる
    names.pop();
    update();
    Count--;
    console.log(names);
  }
}

// 小文字ボタン
function komojiBtn() {
  let komoji = convert2Komoji(names[names.length - 1]);

  if (komoji !== undefined) {
    names.slice(names.length);
    Count--;
    names[Count] = komoji;
    update();
    Count++;

    console.log(names);
  }
}

// スペースボタン
function allDeleteBtn() {
  if (Count !== 0) {
    names = [];
    Count = 0;
  }
  update();
  console.log(names);
}

// 濁点ボタン
function dakuBtn() {
  let dakumoji = convert2Dakuon(names[names.length - 1]);

  if (dakumoji !== undefined) {
    names.slice(names.length);
    Count--;
    names[Count] = dakumoji;
    update();
    Count++;

    console.log(names);
  }
}

// 半濁点ボタン
function HandakuBtn() {
  let Handakumoji = convert2HanDakuon(names[names.length - 1]);

  if (Handakumoji !== undefined) {
    names.slice(names.length);
    Count--;
    names[Count] = Handakumoji;
    update();
    Count++;

    console.log(names);
  }
}

// 決定ボタン
function confirmBtn() {
  if (names.length > 0) {
    console.log('決定');
    openConfirm(`「${names.join('')}」で決定しますか？`);
    // yes・noのイベント登録
    document
      .querySelector('#confirm-dialog-buttons .btn-yes')
      .addEventListener('click', confirmYes);
    document
      .querySelector('#confirm-dialog-buttons .btn-no')
      .addEventListener('click', confirmNo);
  } else {
    console.log('空です');
  }
}

const confirmYes = async () => {
  // 名前を記録してマップへ移動する
  gameData.charName = names.join('');
  // データの初期化
  await toDarking(async () => {
    // ここで名前入力に移動する
    await CreateMap(gameData);
    // 閉じる処理
    confirmNo();
    document.getElementById('keyboard-screen').classList.add('none');
  }, gameData);
};

const confirmNo = () => {
  closeConfirm();
  document
    .querySelector('#confirm-dialog-buttons .btn-yes')
    .removeEventListener('click', confirmYes);
  document
    .querySelector('#confirm-dialog-buttons .btn-no')
    .removeEventListener('click', confirmNo);
};
