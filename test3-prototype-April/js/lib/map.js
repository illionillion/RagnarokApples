import mapItemsJson from "./mapItems.json" assert { type: "json" }
import TextData from './scenario_data.json' assert { type: "json" }
import ScenarioPlayer from './ScenarioPlayer.js'

export function CreateMap(gameState) {

    // マップアイテムの生成
    gameState.eventState = 'map'
    const eleFragment = document.createDocumentFragment()
    // シナリオ格納
    const mapItems = mapItemsJson[gameState.nowPart ?? 'A0']
    // console.log(gameState.nowPart);
    console.log(mapItems);
    for (const itemId in mapItems) {
        if (Object.hasOwnProperty.call(mapItems, itemId)) {
            const item = mapItems[itemId]
            const itemEle = document.createElement('div')
            itemEle.id = itemId
            itemEle.className = 'map-touch'
            itemEle.dataset.place = item.place

            // イベント付与
            itemEle.addEventListener('click',(e) => {
            
                const float = document.getElementById('mapWrapper')
                float.classList.remove('none')
                const pname = document.getElementById('placeName')
                const placeName = e.target.dataset.place
                pname.innerHTML = placeName

                const partKey = item.partKey

                const yesBtn = document.getElementById('mapSelectYes')
                const noBtn = document.getElementById('mapSelectNo')

                /**
                 * 付与するYES/NO選択イベント
                 * @param {*} e event
                 */
                const selectEve = async(e) => {
                    float.classList.add('none')
                    e.target.removeEventListener('click',selectEve,false)//クリックされたボタンのイベントを削除
                    e.target === yesBtn ? noBtn : yesBtn .removeEventListener('click',selectEve,false)//クリックされなかったボタンのイベントを削除
                    
                    const timer = (s) => {
                        return new Promise((resolve,reject)=>{
                            const timerId = setTimeout(() => {
                                // clearTimeout(timerId)
                                resolve()
                            }, s);
                        })
                    }
                    
                    if( e.target === yesBtn ) { // yesが押された

                        // 暗転
                        document.getElementById('darkening-floor').classList.remove('op0')
                        // タイマー
                        await timer(1000);
                        // シナリオ画面へ遷移
                        document.getElementById('textScreen').classList.remove('none')
                        document.getElementById('mapScreen').classList.add('none')
                        // タイマー
                        await timer(1000);
                        // 暗転解除
                        document.getElementById('darkening-floor').classList.add('op0')
                        
                        console.log(TextData[partKey]);//選択されたシナリオ

                        gameState.textEventId++;
                        gameState.nowPart = partKey
                        gameState.TextPlayer = new ScenarioPlayer(TextData[partKey], gameState)//プレイヤー生成
                        
                        // TextPlayerList[gameState.textEventId]=new ScenarioPlayer(TextData[partKey],gameState)//プレイヤー生成
                        // console.log(gameState);
                        // console.log(TextPlayerList);
                        
                        /*------------------
                            テキストの処理 
                        ------------------*/
                        
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

    const spb = document.querySelector('#speechBubble .textarea')
    const msg = '画面をクリック'
    spb.textContent = msg

    if( !mapItems ) alert("ゲーム終了")

}