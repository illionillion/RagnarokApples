import { closeConfirm, openConfirm } from './confirm.js';
import {
  getAudioPath,
  getBackgroundPath,
  getCharacterPath
} from './getAssetsPath.js';
import { CreateMap } from './map.js';
import { openMenuScreen } from './menu.js';
import timer from './timer.js';
import toDarking from './toDarking.js';
export default class ScenarioPlayer {
  /**
   * イベントの世代管理ID
   */
  static eventId = 0;
  /**
   * auto機能がオンになっているか
   */
  static autoPlayingFlag = false;
  /**
   * メニューフラグ
   */
  static menuFlag = false;

  static skipConfirmFlag = false;

  // テキストのパーツ // こいつらstaticつけるべき
  screen = document.getElementById('textScreen');
  dialogueEle = document.getElementById('dialogue');
  dialogueText = document.getElementById('dialogue-text-area');
  autocheck = document.getElementById('autocheck');
  darkeningFloor = document.getElementById('darkening-floor');
  onePicture = document.getElementById('one-picture');
  skipButton = document.getElementById('skipButton');
  skipButtonYes = document.querySelector('#confirm-dialog-buttons .btn-yes');
  skipButtonNo = document.querySelector('#confirm-dialog-buttons .btn-no');
  FloatCheck = document.getElementById('FloatCheck');
  TextFloat = document.getElementById('mapTextFloat');
  TextCover = document.getElementById('mapTextCover');
  MenuOpenButton = document.getElementById('menu-open-button');
  MenuCloseButton = document.getElementById('menu-close-button');
  /**
   * 1パートのテキストのデータを格納する
   * @param {*} TextList テキストのオブジェクト
   * @param {*} state ゲームのステータスのオブジェクト
   */
  constructor (TextList, TextAudio, state) {
    this.TextList = TextList; // シナリオのテキストとそのデータ
    this.state = state; // mainから参照するゲームのデータ
    this.msgindex = 0; // 現在のテキストの番号
    this.day = state.nowDate;
    this.place = state.nowPlace;

    this.startFlag = true; // スタート時のチェック
    this.dialogueFlag = true; // ダイアログが表示か非表示化
    this.autoPlayingCheck = false; // autoが手動で実行されたか
    this.onePictureSwitch = false; // 一枚絵使用
    this.movingFlag = false; // テキストアニメーションが動いてるか
    this.pauseFlag = false; // pauseで停止されたかどうか
    // this.screenDarking = false //暗転中か
    this.screenDarking = state.screenDarking; // 暗転中か

    this.nowEle = []; // 文字列格納
    this.colorFlag = false; // 文字設定処理：色
    this.sizeFlag = false; // 文字設定処理：大文字

    this.nowEveId = ++ScenarioPlayer.eventId; // ScenarioPlayerの世代、これは違えばイベント削除

    this.audios = [];
    this.audios = TextAudio ?? []; // 読み込んだaudioのデータ全体
    this.audioNum = 0; // audioの番号
    this.audioStart = 0; // 次の音声の再生開始させる番号
    this.audioEnd = 0; // 次の音声の再生終了させる番号
    this.audioList = []; // new Audio()プリロード
    this.audioObj = null; // new Audio()格納
    this.toMapFlag = false; // toMapをさせるときの判定

    this.imageBackList = [];
    this.imageCharList = [];

    this.imagePreload();
    this.init();
  }

  /**
   * シナリオ画面遷移とイベントの設定
   */
  async init () {
    // this.audios = await GetScenarioAudioJson()[this.state.nowPart] //読み込んだaudioのデータ全体
    // console.log(this.audios);

    this.state.eventState = 'ScenarioPlayer';

    // 初期化
    this.dialogueText.innerHTML = '';
    document.getElementById('one-picture-text').innerHTML = '';
    document.getElementById('dialogue-name-area').innerHTML = '';
    document.querySelector('#menu-screen .contents').textContent = '';
    document.querySelector('#menu-list .day').textContent = this.day;
    document.querySelector('#menu-list .day').dataset.day = this.day;
    document.querySelector('#menu-list .place').textContent = this.place;
    document.querySelector('#menu-list .place').dataset.place = this.place;
    document.querySelector('#dialogue-text-arrow').classList.add('hide');
    this.autoPlayingCheck = false;
    this.startFlag = true;

    document.addEventListener('keypress', this.openMenuKeyup);

    // イベント付与
    this.screen.addEventListener('click', this.textBoxShowHide, false);
    this.dialogueEle.addEventListener('click', this.clickDialogue, false);
    // this.autocheck.textContent = ScenarioPlayer.autoPlayingFlag ? 'Auto ON' : 'Auto OFF'
    if (ScenarioPlayer.autoPlayingFlag) {
      this.autocheck.classList.add('active');
    } else {
      this.autocheck.classList.remove('active');
    }
    this.autocheck.addEventListener('click', this.autoToggle, false);
    this.darkeningFloor.addEventListener('click', this.darkeningElePrev, false);
    this.onePicture.addEventListener('click', this.onePictureClick, false);
    this.skipButton.addEventListener('click', this.skipConfirm, false);
    this.MenuOpenButton.addEventListener('click', this.openMenu);
    this.MenuCloseButton.addEventListener('click', this.closeMenu);
    document.querySelectorAll('#menu-list ul li').forEach((element) => {
      element.addEventListener('click', this.clickMenuList);
    });

    this.closeMenu();

    // プリロード
    await this.AudioPreload();
    // 1番目に流させる音声を設定
    this.AudioLoading();
  }

  /**
   * クリックされた時にアニメーションを走らせるかどうか
   * @returns キャンセルする
   */
  ScenarioClick = () => {
    let text = this.GetText();

    if (text.length === 0 && !ScenarioPlayer.autoPlayingFlag) {
      this.Loading();
      // console.log(text)
      text = this.GetText();
    }
    if (!this.movingFlag) {
      // this.autoPlayingCheckでautoの待機中にイベントが発生するのを防ぐ
      console.log(ScenarioPlayer.autoPlayingFlag);
      console.log(this.autoPlayingCheck);
      if (ScenarioPlayer.autoPlayingFlag && this.autoPlayingCheck) {
        console.log('cancel'); // autoの待機中にイベントが発生するのを防ぐ
        return;
      } else if (ScenarioPlayer.autoPlayingFlag && !this.autoPlayingCheck) {
        this.autoPlayingCheck = true; // auto初回のみ通る
      }
      if (this.pauseFlag) {
        this.AnimationRestart();
        return;
      }
      this.AnimationStart(text);
    } else {
      this.AnimationForcedEnd(text);
    }
  };

  /**
   * テキストボックス以外をクリックすると、テキストボックスが消えたり現れたりする
   * @returns イベント削除とキャンセル
   */
  textBoxShowHide = (e) => {
    if (this.eventReset()) return;
    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     // console.error('remove');
    //     this.screen.removeEventListener('click',this.textBoxShowHide)
    //     return
    // }
    if (this.onePictureSwitch) {
      // ここで再生開始時、1枚目だった場合非表示にさせない
      // console.error('cancel');
      return;
    }
    if (this.state.screenDarking) {
      // 暗転中は動かさない
      // console.error('cancel');
      return;
    }
    if (this.dialogueFlag) {
      // 非表示
      this.dialogueEle.classList.add('none');
      this.autocheck.classList.add('none');
      this.skipButton.classList.add('none');
      this.MenuOpenButton.classList.add('none');
      this.dialogueFlag = false;
      if (this.movingFlag) this.AnimationPause();
    } else {
      // 表示
      this.dialogueEle.classList.remove('none');
      this.autocheck.classList.remove('none');
      this.skipButton.classList.remove('none');
      this.MenuOpenButton.classList.remove('none');
      this.dialogueFlag = true;
    }
  };

  /**
   * テキストボックスクリックでアニメーション再生
   * @param {*} e 要素
   * @returns イベント削除とキャンセル
   */
  clickDialogue = (e) => {
    e.stopPropagation(); // イベントの伝搬を防止
    if (this.eventReset()) return;

    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.dialogueEle.removeEventListener('click',this.clickDialogue)
    //     return
    // }
    if (this.onePictureSwitch) {
      // 1枚絵使用時はクリック無視
      return;
    }
    if (this.startFlag) {
      this.startFlag = false; // いらない？
      this.Loading();
    } else {
      this.ScenarioClick();
    }
  };

  /**
   * AutoのON/OFF
   * @param {*} e 要素
   * @returns イベント削除とキャンセル
   */
  autoToggle = (e) => {
    e.stopPropagation();
    if (this.eventReset()) return;

    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.autocheck.removeEventListener('click',this.autoToggle)
    //     return
    // }
    ScenarioPlayer.autoPlayingFlag = !ScenarioPlayer.autoPlayingFlag;
    this.state.autoPlayingFlag = ScenarioPlayer.autoPlayingFlag;
    if (ScenarioPlayer.autoPlayingFlag) {
      this.autocheck.classList.add('active');
    } else {
      this.autocheck.classList.remove('active');
    }
    // e.target.textContent = ScenarioPlayer.autoPlayingFlag ? 'Auto ON' :'Auto OFF';
    // auto機能をONからOFFに変更したときautoPlayingCheckを初期化
    if (!ScenarioPlayer.autoPlayingFlag) {
      this.autoPlayingCheck = false;
    }
    // autoで再生中にautoをoffにする時だけ
    if (ScenarioPlayer.autoPlayingFlag && this.movingFlag) {
      this.autoPlayingCheck = true;
    }
    // console.log(ScenarioPlayer.autoPlayingFlag);
  };

  skipConfirm = (e) => {
    e.stopPropagation();

    if (this.eventReset()) return;
    ScenarioPlayer.skipConfirmFlag = true;
    openConfirm('この話をスキップしますか？');
    this.skipButtonYes.addEventListener('click', this.toSkip, false);
    this.skipButtonNo.addEventListener('click', this.skipCancel, false);

    this.AnimationPause();
  };

  /**
   * デバッグ用のスキップ機能（開発中）
   * ここで最後のテキストではなく次のマップ画面へ行かせたい、つまりtoMapの処理する
   * @param {*} e
   */
  toSkip = (e) => {
    e.stopPropagation();

    // console.log("skip");
    // this.msgindex = Object.keys(this.TextList).length - 1;

    // const text = this.GetText();
    // this.AnimationForcedEnd(text);
    ScenarioPlayer.skipConfirmFlag = false;
    this.skipButtonYes.removeEventListener('click', this.toSkip, false);
    this.skipButtonNo.removeEventListener('click', this.skipCancel, false);
    closeConfirm();
    this.toMap();
  };

  skipCancel = () => {
    ScenarioPlayer.skipConfirmFlag = false;
    this.skipButtonYes.removeEventListener('click', this.toSkip, false);
    this.skipButtonNo.removeEventListener('click', this.skipCancel, false);
    closeConfirm();
  };

  /**
   * 暗転要素の伝搬禁止
   * @param {*} e 要素
   * @returns イベント削除とキャンセル
   */
  darkeningElePrev = (e) => {
    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.darkeningFloor.removeEventListener('click',this.darkeningElePrev)
    //     return
    // }
    e.stopPropagation();
  };

  /**
   * 一枚絵の時のイベント発火
   * @param {*} e 要素
   * @returns イベント削除とキャンセル
   */
  onePictureClick = (e) => {
    e.stopPropagation();
    if (this.eventReset()) return;

    // console.log(e.target);
    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.onePicture.removeEventListener('click',this.onePictureClick)
    //     return
    // }
    if (!this.onePictureSwitch) {
      // 1枚絵非使用時はクリック無視
      return;
    }
    this.ScenarioClick();
  };

  /**
   * 一枚絵かノーマルかの切り替え
   * @param {*} speakerName テキストボックスに表示させるキャラの名前（ノーマル時のみ）
   * @param {*} pFragment フラグメント
   */
  onePictureToggle = (speakerName, pFragment) => {
    // 一枚絵の時
    if (this.TextList[this.msgindex].onePicture) {
      this.onePictureSwitch = true;
      // #onePictureに操作
      document.getElementById('one-picture').classList.remove('op0');
      document.getElementById('dialogue').classList.add('op0');
      document.getElementById('one-picture-text').innerHTML = '';
      document.getElementById('one-picture-text').appendChild(pFragment);
      // console.log(this.TextList[this.msgindex]);
    } else {
      this.onePictureSwitch = false;
      document.getElementById('one-picture').classList.add('op0');
      document.getElementById('dialogue').classList.remove('op0');
      document.getElementById('dialogue-name-area').classList.add('op0');
      document.getElementById('dialogue-name-area').innerHTML = speakerName;
      document.getElementById('dialogue-text-area').innerHTML = '';
      document.getElementById('dialogue-text-area').appendChild(pFragment);
    }
  };

  /**
   * テキストを透明にして配置する
   */
  Loading () {
    // 　音声終了
    this.AudioStop();

    document.querySelector('#dialogue-text-arrow').classList.add('hide');

    if (this.msgindex >= Object.keys(this.TextList).length) {
      return;
      // this.msgindex=0;
    }
    console.log(this.TextList[this.msgindex]);

    const spanFragment = document.createDocumentFragment();
    /**
     * 大文字格納用
     */
    let largeHolder;

    const pFragment = document.createDocumentFragment();
    let pEle = document.createElement('p');

    /**
     * 行カウント
     */
    let pCount = 0;

    /**
     * 名前取得
     */
    const speakerName = this.replaceName(this.TextList[this.msgindex].characterText.name); // ここで名前だけ置き換え？
    console.log(speakerName);
    const text = this.replaceName(this.TextList[this.msgindex].characterText.text);
    console.log(text);
    for (
      let i = 0;
      i < text.length;
      i++
    ) {
      /**
       * 取得した文字が記号だった場合は文字演出の終始なのでフラグを反転させてcontinueする
       */
      const element = text[i]; // ここでテキスト内名前置き換え？
      if (element === '/') {
        // 赤文字
        // console.log(element);
        if (this.colorFlag) {
          this.colorFlag = false;
          continue;
        }
        this.colorFlag = true;
        continue;
      }
      if (element === '*') {
        // 大文字
        // console.log(element);
        if (this.sizeFlag) {
          this.sizeFlag = false;
          continue;
        }
        this.sizeFlag = true;
        continue;
      }
      if (element === '$') {
        // 改行
        pEle.appendChild(spanFragment);
        pEle.dataset.pcount = pCount;
        pFragment.appendChild(pEle);
        pEle = document.createElement('p'); // 初期化
        this.colorFlag = false;
        this.sizeFlag = false;
        pCount++;
        continue;
      }
      const span = document.createElement('span'); // 1文字格納
      span.textContent = element;
      span.className = 'op0'; // 透明クラス
      // 上の処理でフラグがtrueになっていたら対応するクラスをspanタグに付与する
      if (this.colorFlag) {
        // 赤文字
        span.classList.add('red');
      }
      if (this.sizeFlag) {
        // 大文字
        span.classList.add('large');
        if (!largeHolder) {
          largeHolder = document.createElement('span');
          largeHolder.className = 'fast-show';
        }
        // 一枚絵且つ、大文字の時は速めに表示させるので別にする
        if (this.TextList[this.msgindex].onePicture) {
          largeHolder.appendChild(span);
          // console.log(largeHolder);
          continue;
        }
      }
      if (largeHolder) {
        spanFragment.appendChild(largeHolder);
      }
      largeHolder = null;
      spanFragment.appendChild(span);
    }
    pEle.appendChild(spanFragment);
    pEle.dataset.pcount = pCount;
    pFragment.appendChild(pEle);
    this.colorFlag = false;

    // 一枚絵かノーマルか切り替え
    this.onePictureToggle(speakerName, pFragment);

    // 音声再生
    this.AudioPlaying();

    this.msgindex++;
  }

  /**
   * `.op0`がかかっている`span`のリストを取得する
   * @returns NodeListOf<Element>
   */
  GetText = () => {
    return document.querySelectorAll(
      `#${
        this.onePictureSwitch ? 'one-picture-text' : 'dialogue-text-area'
      } .op0`
    );
  };

  /**
   * アニメーション再生
   * @param {*} text cp0クラスがついているspanタグ
   * @param {boolean} restartFlag cp0クラスがついているspanタグ
   */
  AnimationStart = async (text, restartFlag) => {
    this.nowEle = text;
    this.pauseFlag = false;

    // console.log(text);
    if (this.toMapFlag) {
      this.toMap(); // マップへ戻る(非auto)
      return;
    }

    if (ScenarioPlayer.menuFlag) {
      this.autoPlayingCheck = false;
      console.log('return!!!');
      return;
    }
    if (ScenarioPlayer.skipConfirmFlag) {
      this.autoPlayingCheck = false;
      console.log('return!!!');
      return;
    }

    // テキスト1文字ずつ描画
    this.movingFlag = true; // これがtrueの時に暗転させないとアニメーションが止まらない、もしくはローディングのところでするか

    // リスタート時は暗転をさせない
    if (
      this.TextList[this.msgindex - 1].characterText.effect.darkening &&
      !restartFlag
    ) {
      console.log('restartFlag is ' + restartFlag);
      await toDarking(undefined, this.state); // ここで暗転のみを実行させたい
    }

    // 画像の変更
    await this.changeImage();

    /**
     * 1枚絵の時だけ先行して別速度で表示させるループ
     */
    const p = new Promise(async (resolve, reject) => {
      let fastFlag = false;
      for (const ele of text) {
        if (!this.movingFlag) {
          return;
        }
        await timer(10);
        if (ele.parentNode.classList.contains('fast-show')) {
          // 1枚絵の時だけ先行して別速度で表示させる
          fastFlag = true;
          ele.classList.remove('op0');
          await timer(100);
        } else {
          if (fastFlag) {
            await timer(500);
            fastFlag = false;
          }
        }
      }
      resolve();
    });
    // 通常時のループ
    for (const ele of text) {
      if (!this.movingFlag) {
        // console.log("stop");
        if (!this.dialogueFlag) {
          this.autoPlayingCheck = false;
          // console.log('');
          // break
          return; // オートで再生中にダイアログ非表示で停止させた場合
        }
        if (ScenarioPlayer.menuFlag) {
          this.autoPlayingCheck = false;
          console.log('return');
          return; // メニューが起動したら普通に停止
        }
        if (ScenarioPlayer.skipConfirmFlag) {
          this.autoPlayingCheck = false;
          console.log('return');
          return; // スキップ確認ダイアログが起動したら普通に停止
        }
        break; // テキスト強制終了でautoがtrueならで次へい行かせる
      }
      if (!this.dialogueFlag && !this.onePictureSwitch) {
        this.autoPlayingCheck = false;
        this.movingFlag = false;
        // console.log('');
        // break;
        return; // オートで再生中にダイアログ非表示で停止させた場合
      }
      if (!ele.classList.contains('op0')) {
        // アニメーション再スタート時op0持ってない場合は飛ばす
        continue;
      }
      await timer(100);
      // console.log(ele);
      ele.classList.remove('op0');
    }

    document.querySelector('#dialogue-text-arrow').classList.remove('hide');
    this.next();
  };

  /**
   * 次のテキスト・マップへ移動
   * @returns 中断
   */
  next = async () => {
    this.movingFlag = false;

    const nextFlag = this.msgindex >= Object.keys(this.TextList).length; // true => 次がない場合
    if (ScenarioPlayer.autoPlayingFlag) {
      await timer(1000); // この待機中にAnimationStartが走るとおかしくなる
      console.log('auto');
      // console.log(text);
      if (!this.dialogueFlag && !this.onePictureSwitch) {
        this.autoPlayingCheck = false;
        return;
      }
      this.Loading();
      const nexttext = this.GetText();
      if (!nextFlag) {
        this.AnimationStart(nexttext);
      } else {
        this.toMapFlag = true;
        this.toMap(); // マップへ戻る(auto)
      }
    } else {
      if (nextFlag) {
        this.toMapFlag = true;
      }
    }
  };

  /**
   * 外部からマップに戻すときに実行するやつ
   */
  static screenReset = () => {
    // シナリオ画面へ遷移
    document.getElementById('textScreen').classList.add('none');
    document.getElementById('mapScreen').classList.remove('none');
    // いろいろ初期化
    document.getElementById('textBackground').src =
      'images/background/concept.png';
    document.querySelector('#character-left img').src =
      'images/character/transparent_background.png';
    document.querySelector('#character-left-center img').src =
      'images/character/transparent_background.png';
    document.querySelector('#character-center img').src =
      'images/character/transparent_background.png';
    document.querySelector('#character-right img').src =
      'images/character/transparent_background.png';
    document.querySelector('#character-right-center img').src =
      'images/character/transparent_background.png';
    document.querySelector('#menu-screen .menu-title span').textContent =
      'MENU';
    document.getElementById('mapTextCover').classList.remove('none');
    document.getElementById('FloatCheck').classList.add('op0');
    document.getElementById('mapTextFloat').classList.add('op0');
    document.getElementById('dialogue').classList.remove('op0');
    document.getElementById('one-picture').classList.add('op0');
  };

  /**
   * シナリオ画面からマップ画面へ戻る
   */
  toMap = async (isTitle = false) => {
    this.AudioStop();
    console.log('end');
    this.state.eventState = 'map';

    await toDarking(async (e) => {
      // シナリオ画面へ遷移
      document.getElementById('textScreen').classList.add('none');
      document.getElementById('mapScreen').classList.remove('none');
      // いろいろ初期化
      document.getElementById('textBackground').src =
        'images/background/concept.png';
      document.querySelector('#character-left img').src =
        'images/character/transparent_background.png';
      document.querySelector('#character-left-center img').src =
        'images/character/transparent_background.png';
      document.querySelector('#character-center img').src =
        'images/character/transparent_background.png';
      document.querySelector('#character-right img').src =
        'images/character/transparent_background.png';
      document.querySelector('#character-right-center img').src =
        'images/character/transparent_background.png';
      document.querySelector('#menu-screen .menu-title span').textContent =
        'MENU';
      if(!isTitle) this.TextCover.classList.remove('none');
      this.FloatCheck.classList.add('op0');
      this.TextFloat.classList.add('op0');
      this.dialogueEle.classList.remove('op0');
      this.onePicture.classList.add('op0');

      // ここにremoveEvent書く？
      this.screen.removeEventListener('click', this.textBoxShowHide, false);
      this.dialogueEle.removeEventListener('click', this.clickDialogue, false);
      this.autocheck.removeEventListener('click', this.autoToggle, false);
      this.darkeningFloor.removeEventListener(
        'click',
        this.darkeningElePrev,
        false
      );
      this.onePicture.removeEventListener('click', this.onePictureClick, false);
      this.skipButton.removeEventListener('click', this.skipConfirm, false);
      this.MenuOpenButton.removeEventListener('click', this.openMenu);
      this.MenuCloseButton.removeEventListener('click', this.closeMenu);
      document.removeEventListener('keypress', this.openMenuKeyup);

      document.querySelectorAll('#menu-list ul li').forEach((element) => {
        element.removeEventListener('click', this.clickMenuList);
      });

      this.state.nowPart = this.state.nextPart;
      // ここに新マップ描画処理
      if(!isTitle) await CreateMap(this.state);
    }, this.state);
  };

  /**
   * IDが違う場合はイベントリセット
   * @returns {boolean} true: リセット, false: 非リセット
   */
  eventReset = () => {
    if (ScenarioPlayer.eventId !== this.nowEveId) {
      console.log('prev screen events reset');
      this.screen.removeEventListener('click', this.textBoxShowHide, false);
      this.dialogueEle.removeEventListener('click', this.clickDialogue, false);
      this.autocheck.removeEventListener('click', this.autoToggle, false);
      this.darkeningFloor.removeEventListener(
        'click',
        this.darkeningElePrev,
        false
      );
      this.onePicture.removeEventListener('click', this.onePictureClick, false);
      this.skipButton.removeEventListener('click', this.skipConfirm, false);
      this.MenuOpenButton.removeEventListener('click', this.openMenu);
      this.MenuCloseButton.removeEventListener('click', this.closeMenu);
      document.removeEventListener('keypress', this.openMenuKeyup);

      document.querySelectorAll('#menu-list ul li').forEach((element) => {
        element.removeEventListener('click', this.clickMenuList);
      });

      return true;
    }

    return false;
  };

  /**
   * アニメーションを一時停止
   */
  AnimationPause = () => {
    this.movingFlag = false;
    this.pauseFlag = true;
  };

  /**
   * アニメーションを再スタート
   * @returns キャンセル
   */
  AnimationRestart = () => {
    console.log('restart');
    if (this.movingFlag) {
      return;
    }
    this.AnimationStart(this.nowEle, true);
  };

  /**
   * アニメーション再生中に画面タッチがされたら終了させる
   * @param {*} text cp0クラスがついているspanタグ
   */
  AnimationForcedEnd = (text) => {
    text.forEach((element) => {
      element.classList.remove('op0');
    });
    this.movingFlag = false;
  };

  /**
   * 画像変更をする
   */
  changeImage = async () => {
    const fileName =
      this.TextList[this.msgindex - 1].backgroundImage.fileName;
    if (
      document.getElementById('textBackground').src.indexOf(fileName) === -1
    ) {
      // 画像の変更がある時のみ暗転
      await toDarking(async (e) => {
        document.getElementById('dialogue-name-area').classList.remove('op0'); // 名前表示
        await this.characterSetting(
          this.TextList[this.msgindex - 1].characterList
        ); // キャラ画像反映
        await this.backgroundSetting(
          this.TextList[this.msgindex - 1].backgroundImage
        ); // 読み込み終了=>画面反映まで暗転させたい
      }, this.state);
    } else {
      // 画像が同じ=>暗転しない場合
      document.getElementById('dialogue-name-area').classList.remove('op0'); // 名前表示
      await this.characterSetting(
        this.TextList[this.msgindex - 1].characterList
      ); // キャラ画像反映
    }
  };

  /**
   * キャラを設定する
   * @param {*} props キャラのオブジェクト
   */
  characterSetting = async (props) => {
    // console.log(props);
    for (const positon in props) {
      if (Object.hasOwnProperty.call(props, positon)) {
        const element = props[positon];
        // const src = `images/character/${element.src}`
        const src = (await getCharacterPath()) + '/' + element.src;
        document.querySelector(
          `#character-area [data-position=${positon}] img`
        ).src = src;
        document.querySelector(
          `#character-area [data-position=${positon}] img`
        ).alt = element.name;
        if (element.status.brightnessDown) {
          document.querySelector(
            `#character-area [data-position=${positon}] img`
          ).style.opacity = '0.8';
        } else {
          document.querySelector(
            `#character-area [data-position=${positon}] img`
          ).style.opacity = '1';
        }
      }
    }
  };

  /**
   * 背景画像設定
   * @param {*} imageObj 画像オブジェクト
   */
  backgroundSetting = async (imageObj) => {
    // srcを変えるだけだが、切り替えに時間がかかってしまう
    // const src = `images/background/${imageObj['fileName']}`
    const src = (await getBackgroundPath()) + '/' + imageObj.fileName;
    document.getElementById('textBackground').src = src;
    document
      .getElementById('textBackground')
      .setAttribute('alt', imageObj.name);
  };

  /**
   * 画像のプリロード
   */
  imagePreload = async () => {
    for (const textEle of this.TextList) {
      const imgname = textEle.backgroundImage.fileName;
      // もし初回なら
      // console.log(this.imageBackList);
      if (this.imageBackList.indexOf(imgname) === -1) {
        console.log(imgname);
        this.imageBackList.push(imgname);
        const imgele = document.createElement('img');
        // const imgsrc = `images/background/${imgname}`
        const imgsrc = (await getBackgroundPath()) + '/' + imgname;
        imgele.src = imgsrc;
      }

      const charObj = textEle.characterList;
      for (const key in charObj) {
        if (Object.hasOwnProperty.call(charObj, key)) {
          const charname = charObj[key].src;
          if (this.imageCharList.indexOf(charname) === -1) {
            // console.log(this.imageCharList);
            console.log(charname);
            this.imageCharList.push(charname);
            const charimgele = document.createElement('img');
            // const charsrc = `images/character/${charname}`
            const charsrc = (await getCharacterPath()) + '/' + charname;
            charimgele.src = charsrc;
          }
        }
      }
    }
  };

  /**
   * 音声ファイルのプリロード
   */
  AudioPreload = async () => {
    for (const i in this.audios) {
      if (Object.hasOwnProperty.call(this.audios, i)) {
        const v = this.audios[i];
        const obj = {};
        // obj.audio = new Audio(`audio/${v.file}`)
        obj.audio = new Audio((await getAudioPath()) + '/' + v.file);
        obj.audio.loop = true;
        obj.audio.preload = 'auto';
        obj.audioLoad = false;
        this.audioList[i] = obj;
        obj.audio.addEventListener('canplaythrough', (e) => {
          obj.audioLoad = true;
        });
        // obj.audio.addEventListener('timeupdate',e=>{
        //     // console.log(obj.audio.currentTime);
        // })
      }
    }
  };

  /**
   * 音声ファイル読み込み・変更
   */
  AudioLoading = () => {
    if (this.audioNum >= this.audios.length) {
      return;
    }
    this.audioObj = this.audioList[this.audioNum].audio;
    this.audioStart = this.audios[this.audioNum].start;
    this.audioEnd = this.audios[this.audioNum].end;
  };

  /**
   * 音声再生
   */
  AudioPlaying = () => {
    console.log('AudioPlaying');
    console.log(this.audios);
    if (this.audioNum >= this.audios.length) {
      return;
    }
    if (this.msgindex === this.audioStart) {
      if (this.audioList[this.audioNum].audioLoad) {
        console.log('play!!');
        const obj = this.audioObj.play();
        console.log(obj);
        if (obj !== undefined) {
          obj
            .then((e) => {
              console.log('再生OK');
            })
            .catch((error) => {
              console.log('エラー', error);
            });
        }
      } else {
        console.log('読み込めていない');
        // 再帰で再実行
        this.AudioPlaying();
      }
    }
  };

  /**
   * 音性終了
   */
  AudioStop = () => {
    if (this.audioNum >= this.audios.length) {
      return;
    }
    if (this.msgindex >= this.audioEnd + 1) {
      console.log('pause');
      this.audioObj.pause();
      this.audioNum++;
      this.AudioLoading();
    }
  };

  /**
   * メニューの表示
   * @param {Event} e
   */
  openMenu = (e) => {
    // console.log('click!');
    e?.stopPropagation();
    if (this.eventReset()) return;

    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.MenuOpenButton.removeEventListener('click', this.openMenu)
    //     return
    // }
    ScenarioPlayer.menuFlag = true;
    // メニュー起動
    // document.getElementById("menu-frame").classList.remove("hide");
    openMenuScreen();
    this.MenuOpenButton.classList.add('hide');
    if (this.movingFlag) {
      // ここでアニメーションを停止させたい
      this.AnimationPause();
    }
    console.log('open');
    console.log(this.movingFlag);
    console.log(this.screenDarking);
  };

  /**
   * キー入力
   * @param {Event} e
   */
  openMenuKeyup = (e) => {
    e?.stopPropagation();
    if (this.eventReset()) return;

    // console.log('key press!!');
    // console.log(ScenarioPlayer.menuFlag);

    addEventListener(
      'keyup',
      (function (thisObj) {
        return function f (event) {
          if (
            (event.key === 'm' || event.key === 'M') &&
            ScenarioPlayer.menuFlag === false
          ) {
            // 開く
            document.getElementById('menu-frame').classList.remove('hide');
            thisObj.MenuOpenButton.classList.add('hide');
            ScenarioPlayer.menuFlag = true;

            if (thisObj.movingFlag) {
              // アニメーション停止
              thisObj.AnimationPause();
            }
          } else {
            // 閉じる
            document.getElementById('menu-frame').classList.add('hide');
            thisObj.MenuOpenButton.classList.remove('hide');
            ScenarioPlayer.menuFlag = false;

            // アニメーション再スタート
            // 暗転中・待機中は再スタートさせないようにすれば良い？
            // if (thisObj.pauseFlag) {
            //     thisObj.AnimationRestart() // これだと、autoで切り替わる瞬間にメニュー開閉したら再スタートしなくなる
            // }
          }
          // console.log(ScenarioPlayer.menuFlag);
          // イベント削除
          removeEventListener('keyup', f);
        };
      })(this)
    );
  };

  /**
   * メニュー非表示
   * @param {Event} e
   */
  closeMenu = (e) => {
    e?.stopPropagation();
    if (this.eventReset()) return;

    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     this.MenuCloseButton.removeEventListener('click', this.closeMenu)
    //     return
    // }
    ScenarioPlayer.menuFlag = false; // 反転

    // メニューclose
    // document.getElementById("menu-frame").classList.add("hide");
    // closeMenuScreen()
    this.MenuOpenButton.classList.remove('hide');
    // this.AnimationRestart()
  };

  /**
   * 名前の置き換え
   * @param {string} text 
   * @returns 
   */
  replaceName = (text) => {
    return text.replace(/\[hero-name\]/g, this.state.charName);
  };

  /**
   * メニューリストクリック時
   * @param {Event} e
   */
  clickMenuList = (e) => {
    e.stopPropagation();
    if (this.eventReset()) return;

    // if (ScenarioPlayer.eventId != this.nowEveId) {
    //     console.log('remove');
    //     e.target.removeEventListener('click', this.closeMenu)
    //     return
    // }
    const text = e.target.textContent;
    console.log(text + ' click');

    if (!['day', 'place'].includes(e.target.dataset.menubutton)) {
      document.querySelector('#menu-screen .menu-title span').textContent =
        text;

      switch (e.target.dataset.menubutton) {
        case 'log':
          const ulEle = document.createElement('ul');
          const fragment = document.createDocumentFragment();
          // ログ画面生成
          for (let i = 0; i < this.msgindex - 1; i++) {
            const ele = this.TextList[i];
            const liEle = document.createElement('li');
            const replace = (text) =>
              text.replace(/\*/g, '').replace(/\$/g, '').replace(/\//g, '');
            console.log(replace(ele.characterText.text));
            liEle.innerHTML = `<span class="person-name">${
              ele.characterText.name
            }:</span><span class="person-serif">${replace(
              ele.characterText.text
            )}</span>`;
            fragment.appendChild(liEle);
          }
          ulEle.appendChild(fragment);
          document.querySelector('#menu-screen .contents').innerHTML = '';
          document.querySelector('#menu-screen .contents').appendChild(ulEle);

          break;
        case 'save':
          // openGameDataScreen("save");
          break;
        case 'load':
          // openGameDataScreen("load");
          break;
        case 'title':
          // ここでタイトル画面に戻す
          // console.log('to title');
          this.toMap(true);
          break;

        default:
          break;
      }
    }
  };
}
