"use strict"
import ScenarioPlayer from './lib/ScenarioPlayer.js';
// import TextDataA from './lib/TextDataA.json.js';
import TextData from './lib/TextDataZeroDay.json.js';
import FrameSizing from "./lib/FrameSizing.js"
import mapItems from "./lib/mapItems.json.js"

(function(){
    const gameState = {
        textEventId: -1,
        nowPart: null,
        FloatCheck: true,
        nowDate: 0,
        eventState: 'title'
    }
    let TextPlayer
    const TextPlayerList = []
    
    window.addEventListener('resize',(e)=>{
        FrameSizing()
    })
    window.addEventListener('load',(e)=>{

        document.body.oncontextmenu = () => {return false}

        FrameSizing()

        // 伝搬チェック用
        // document.querySelectorAll('*').forEach(element => {
        //     element.addEventListener('click',e=>{
        //         console.log(e.target);
        //     })
        // });

        // マップアイテムの生成
        gameState.eventState = 'map'
        const eleFragment = document.createDocumentFragment()
        for (const itemId in mapItems) {
            if (Object.hasOwnProperty.call(mapItems, itemId)) {
                const item = mapItems[itemId]
                const itemEle = document.createElement('div')
                itemEle.id = itemId
                itemEle.className = 'map-touch'
                itemEle.dataset.place = item.place

                // イベント付与
                itemEle.addEventListener('click',(e)=>{
                
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
                    const selectEve = (e) => {
                        float.classList.add('none')
                        e.target.removeEventListener('click',selectEve,false)//クリックされたボタンのイベントを削除
                        e.target === yesBtn ? noBtn : yesBtn .removeEventListener('click',selectEve,false)//クリックされなかったボタンのイベントを削除
                        
                        const timer = (s) => {
                            return new Promise((res,rej)=>{
                                setTimeout(() => {
                                    res()
                                }, s);
                            })
                        }
                        if( e.target === yesBtn ) { // yesが押された
                            
                            (async ()=>{

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
                                TextPlayer = new ScenarioPlayer(TextData[partKey], gameState)//プレイヤー生成
                                
                                // TextPlayerList[gameState.textEventId]=new ScenarioPlayer(TextData[partKey],gameState)//プレイヤー生成
                                // console.log(gameState);
                                // console.log(TextPlayerList);
                                
                                /*------------------
                                    テキストの処理 
                                ------------------*/

                                
                            })()
                            
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
        document.getElementById('mapItems').appendChild(eleFragment)

        // マップ画面遷移系
        const spb = document.getElementById('speechBubble')
        const FloatCheck = document.getElementById('FloatCheck')
        const TextFloat = document.getElementById('mapTextFloat')
        const TextCover = document.getElementById('mapTextCover')
        TextCover.addEventListener('click', (e) => { //1から2へ遷移
            TextCover.classList.add('none')
            FloatCheck.classList.remove('op0')
            TextFloat.classList.remove('op0')
        })

        FloatCheck.addEventListener('click',(e)=>{ //2と3の切り替え 
            if (gameState.FloatCheck) {
                gameState.FloatCheck = false
                FloatCheck.innerHTML = 'OFF'
                TextFloat.classList.add('op0')
            }else{
                gameState.FloatCheck = true
                FloatCheck.innerHTML = 'ON'
                TextFloat.classList.remove('op0')
            }
            // console.log(gameState.FloatCheck)
        })

        let floatSpbTextList = [
            'あああああ',
            'いいいいい',
            'ううううう'
        ]
        let floatSpbTextCount = 0
        // マップ②の画面下のテキスト処理
        const floatSpb = document.getElementById('FloatSpeechBubble')
        const floatSpbText = document.querySelector('#FloatSpeechBubble .textarea')
        // console.log(floatSpbText);
        floatSpbText.addEventListener('click', e => {
            // console.log(e.target.innerHTML);
            if (floatSpbTextCount >= floatSpbTextList.length) floatSpbTextCount = 0
            e.target.innerHTML = floatSpbTextList[floatSpbTextCount]
            floatSpbTextCount++
        })


        /**
         * 日付の設定
         */
        const setDate = () => {
            // 日付の設定
            document.getElementById('date').innerHTML = `${gameState.nowDate}日目`
        }

        setDate()


    })
})()