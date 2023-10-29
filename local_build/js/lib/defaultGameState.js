import { initGameData } from './GameData.js';
import { initMenu } from './menu.js';
import { TitleInit } from './title.js';

export const defaultGameState = {
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

export const dataReset = () => {
  initGameData(defaultGameState);
  initMenu(defaultGameState);
  TitleInit(defaultGameState);
};