// import mapItemsJson from "./json/mapItems.json" assert { type: "json" }
import GetJson from "./GetJson.js";
import ScenarioPlayer from "./ScenarioPlayer.js";
import toDarking from "./toDarking.js";

/**
 * マップ作成の世代ID
 */
let CreateMapCount = 0;
/**
 * テキストのデータ
 */
let TextData;
/**
 * オーディオのデータ
 */
let TextAudio;
/**
 * マップのデータ
 */
let mapItemsJson;

/**
 * マップ作成
 * @param {object} gameState
 */
export async function CreateMap(gameState) {
  /*
    データ取得
    ここのURLを.envで隠したい
    GetJson以外の方法（Electronのメインプロセス）でhttpリクエストでJSONファイルをダウンロードするやつも作るか要検討
    */
  TextData ??= await GetJson(window?.myAPI?.URLS?.SCENARIO_DATA_JSON); // .envから読み込んできたURL
  TextAudio ??= await GetJson(window?.myAPI?.URLS?.SCENARIO_AUDIO_DATA_JSON); // .envから読み込んできたURL
  mapItemsJson ??= await GetJson(window?.myAPI?.URLS?.SCENARIO_MAP_DATA_JSON); // .envから読み込んできたURL

  const NowCreateMapCount = ++CreateMapCount;

  // マップアイテムの生成
  gameState.eventState = "map";
  const mapData = mapItemsJson[gameState.nowPart];
  gameState.eventState = "map";
  gameState.nowDate = mapData["day"];
  // シナリオ格納
  const mapItems = mapData && mapData["items"];

  document
    .querySelectorAll(".map-touch")
    .forEach((ele) => ele.classList.add("none"));

  for (const itemId in mapItems) {
    if (Object.hasOwnProperty.call(mapItems, itemId)) {
      const item = mapItems[itemId];
      // 要素を作成するのではなくjsonから取得したIDの.map-touch要素を探して取得
      const itemEle = document.querySelector(
        `.map-touch[data-place=${item.place}]`
      );
      itemEle.classList.remove("none");
      const itemButton = itemEle.querySelector(".map-title-button");

      const touchEvent = () => {
        const float = document.getElementById("mapWrapper");
        float.classList.remove("none");
        document
          .querySelectorAll(".placeName")
          .forEach((ele) => ele.classList.add("none"));
        document
          .querySelector(`.placeName[data-place="${item.place}"]`)
          .classList.remove("none");

        // 登場キャラアイコン変更
        const mapCharacterListImgs = document.querySelectorAll(
          "#mapCharacterList ul li img"
        );
        for (const i in mapCharacterListImgs) {
          if (Object.hasOwnProperty.call(mapCharacterListImgs, i)) {
            const ele = mapCharacterListImgs[i];
            if (
              ["app.png", "tau-sample.jpg"].includes(item["characterIcons"][i])
            ) {
              ele.src = `images/map-screen/map3-default-icon.png`;
            } else {
              ele.src = `images/character/icon/${item["characterIcons"][i]}`;
            }
          }
        }

        const partKey = item.partKey;

        const yesBtn = document.getElementById("mapSelectYes");
        const noBtn = document.getElementById("mapSelectNo");

        /**
         * 付与するYES/NO選択イベント
         * @param {*} e event
         */
        const selectEve = async (e) => {
          float.classList.add("none");
          e.target.removeEventListener("click", selectEve, false); //クリックされたボタンのイベントを削除
          e.target === yesBtn
            ? noBtn
            : yesBtn.removeEventListener("click", selectEve, false); //クリックされなかったボタンのイベントを削除

          if (e.target === yesBtn) {
            // yesが押された

            itemButton.removeEventListener("click", touchEvent);

            // 暗転
            await toDarking((e) => {
              // シナリオ画面へ遷移
              document.getElementById("textScreen").classList.remove("none");
              document.getElementById("mapScreen").classList.add("none");

              console.log(TextData[partKey]); //選択されたシナリオ

              gameState.prevPart = gameState.nowPart;
              gameState.nowPart = partKey;
              // gameState.nowDate = mapData["day"];
              gameState.nowPlace = item.place;
              new ScenarioPlayer(
                TextData[partKey],
                TextAudio[partKey],
                gameState
              ); //プレイヤー生成
            }, gameState);
          }
        };

        yesBtn.addEventListener("click", selectEve, false);
        noBtn.addEventListener("click", selectEve, false);
      };

      // アイコンタッチ時のイベント付与
      itemButton.addEventListener("click", touchEvent);
    }
  }

  // 立ち絵変更
  const mapTextCharacter = document.querySelector("#mapTextCharacter img");
  mapTextCharacter.src = mapData
    ? `images/character/${mapData["mapMessageCharacter"]}`
    : `images/character/testpicture_tau.png`;

  const spb = document.querySelector("#speechBubble .textarea");
  const msg = mapData ? mapData["mapMessageText"] : "テキスト切れ";
  spb.textContent = msg;

  // tipsのアイコン変更
  const mapTextIcon = document.querySelector("#mapTextIcon img");
  mapTextIcon.src = mapData
    ? `images/character/icon/${mapData["mapTextIcon"]}`
    : `images/character/icon/app.png`;

  const floatSpbTextList = mapData
    ? mapData["tipsMessage"]
    : {
        0: "Tips:黒い四角の範囲が選択できます",
        1: "どこへ行こう？",
        2: "上の方かな？",
        3: "下でもあり",
      };
  let floatSpbTextCount = 0;
  // マップ②の画面下のテキスト処理
  const floatSpbText = document.querySelector("#FloatSpeechBubble .textarea");
  // console.log(floatSpbText);
  floatSpbText.innerHTML = floatSpbTextList[floatSpbTextCount];
  floatSpbText.addEventListener(
    "click",
    (function () {
      return function f(e) {
        if (CreateMapCount !== NowCreateMapCount) {
          floatSpbText.removeEventListener("click", f);
        }

        // console.log(e.target.innerHTML);
        floatSpbTextCount++;
        if (floatSpbTextCount >= Object.keys(floatSpbTextList).length)
          floatSpbTextCount = 0;
        e.target.innerHTML = floatSpbTextList[floatSpbTextCount];
      };
    })()
  );

  // const mapImg = document.getElementById("mapBackground");
  // const imgSrc = mapData
  //   ? `images/background/${mapData["backgroundImage"]}`
  //   : "images/background/map.png";
  // const imgSrc = "images/map-screen/map2_background.png";
  // console.log(imgSrc);
  // mapImg.setAttribute("src", imgSrc);
  // 日付
  document.querySelector("#map2TextDate").innerHTML = mapData
    ? mapData["day"]
    : "0日目";
  document.querySelector("#map1TextDate").innerHTML = mapData
    ? mapData["day"]
    : "0日目";

  if (!mapData) alert("ゲーム終了");
}
