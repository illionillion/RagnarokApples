import mapItemsJson from "./json/mapItems.json" assert { type: "json" }
import GetJson from "./GetJson.js"
import ScenarioPlayer from './ScenarioPlayer.js'
import toDarking from "./toDarking.js"

/**
 * マップ作成の世代ID
 */
let CreateMapCount = 0
/**
 * テキストのデータ
 */
let TextData
/**
 * オーディオのデータ
 */
let TextAudio

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
    TextData ??= await GetJson(window?.myAPI?.URLS?.SCENARIO_DATA_JSON) // .envから読み込んできたURL
    TextAudio ??= await GetJson(window?.myAPI?.URLS?.SCENARIO_AUDIO_DATA_JSON) // .envから読み込んできたURL

    const NowCreateMapCount = ++CreateMapCount

    // マップアイテムの生成
    gameState.eventState = 'map'
    const eleFragment = document.createDocumentFragment()
    const mapData = mapItemsJson[gameState.nowPart]
    // シナリオ格納
    const mapItems = mapData && mapData["items"]
    // console.log(gameState.nowPart);
    // console.log(mapItems);
    for (const itemId in mapItems) {
        if (Object.hasOwnProperty.call(mapItems, itemId)) {
            const item = mapItems[itemId]
            const itemEle = document.createElement('div')
            itemEle.id = itemId
            itemEle.className = 'map-touch'
            itemEle.dataset.place = item.place
            const imgEle = document.createElement('img')
            imgEle.src = `images/mapicon/${item["iconImage"]}`
            itemEle.appendChild(imgEle)

            // アイコンタッチ時のイベント付与
            imgEle.addEventListener('click',(e) => {

                const float = document.getElementById('mapWrapper')
                float.classList.remove('none')
                const pname = document.getElementById('placeName')
                const placeName = e.target.parentElement.dataset.place
                pname.innerHTML = placeName

                // 登場キャラアイコン変更
                const mapCharacterListImgs = document.querySelectorAll('#mapCharacterList ul li img')
                for (const i in mapCharacterListImgs) {
                    if (Object.hasOwnProperty.call(mapCharacterListImgs, i)) {
                        const ele = mapCharacterListImgs[i];
                        ele.src = `images/character/icon/${item["characterIcons"][i]}`
                    }
                }

                const partKey = item.partKey

                const yesBtn = document.getElementById('mapSelectYes')
                const noBtn = document.getElementById('mapSelectNo')

                /**
                 * 付与するYES/NO選択イベント
                 * @param {*} e event
                 */
                const selectEve = async (e) => {
                    float.classList.add('none')
                    e.target.removeEventListener('click',selectEve,false)//クリックされたボタンのイベントを削除
                    e.target === yesBtn ? noBtn : yesBtn .removeEventListener('click',selectEve,false)//クリックされなかったボタンのイベントを削除

                    if( e.target === yesBtn ) { // yesが押された

                        // 暗転
                        await toDarking( e => {
                            // シナリオ画面へ遷移
                            document.getElementById('textScreen').classList.remove('none')
                            document.getElementById('mapScreen').classList.add('none')

                            console.log(TextData[partKey]);//選択されたシナリオ
    
                            gameState.textEventId++;
                            gameState.nowPart = partKey
                            gameState.TextPlayer = new ScenarioPlayer(TextData[partKey], TextAudio[partKey], gameState)//プレイヤー生成

                        }, gameState)

                    }

                }

                yesBtn.addEventListener('click',selectEve,false)
                noBtn.addEventListener('click',selectEve,false)
            })

            // スタイル付与
            const styles = item.style
            for (const prop in styles) {
                if (Object.hasOwnProperty.call(styles, prop)) {
                    const val = styles[prop]
                    itemEle.style[prop] = val
                }
            }

            // フラグメントにappend
            eleFragment.appendChild(itemEle)
        }
    }
    // DOMにappend
    document.getElementById('mapItems').innerHTML = ''
    document.getElementById('mapItems').appendChild(eleFragment)

    // 立ち絵変更
    const mapTextCharacter = document.querySelector('#mapTextCharacter img')
    mapTextCharacter.src = mapData ? `images/character/${mapData["mapMessageCharacter"]}` : `images/character/bengal.png`
    
    const spb = document.querySelector('#speechBubble .textarea')
    const msg = mapData ? mapData['mapMessageText'] : 'テキスト切れ'
    spb.textContent = msg
    
    // tipsのアイコン変更
    const mapTextIcon = document.querySelector('#mapTextIcon img')
    mapTextIcon.src = mapData ? `images/character/icon/${mapData["mapTextIcon"]}` : `images/character/icon/app.png`

    const floatSpbTextList = mapData ? mapData['tipsMessage'] : 
        {
            0 : 'Tips:黒い四角の範囲が選択できます',
            1 : 'どこへ行こう？',
            2 : '上の方かな？',
            3 : '下でもあり',
        }
    let floatSpbTextCount = 0
    // マップ②の画面下のテキスト処理
    const floatSpbText = document.querySelector('#FloatSpeechBubble .textarea')
    // console.log(floatSpbText);
    floatSpbText.innerHTML = floatSpbTextList[floatSpbTextCount]
    floatSpbText.addEventListener('click', (function() {
        return function f(e) {
            if (CreateMapCount !== NowCreateMapCount) {
                floatSpbText.removeEventListener('click', f)
            }

            // console.log(e.target.innerHTML);
            floatSpbTextCount++
            if (floatSpbTextCount >= Object.keys(floatSpbTextList).length) floatSpbTextCount = 0
            e.target.innerHTML = floatSpbTextList[floatSpbTextCount]
        }
    }()))

    const mapImg = document.getElementById('mapBackground')
    const imgSrc = mapData ? `images/background/${mapData['backgroundImage']}` : 'images/background/map.png'
    // console.log(imgSrc);
    mapImg.setAttribute('src', imgSrc)

    // 日付
    document.querySelector('#date > p').innerHTML = mapData ? mapData["day"] : '0日目'

    if( !mapData ) alert("ゲーム終了")

}