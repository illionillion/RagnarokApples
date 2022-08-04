"use strict"
import ScenarioPlayer from './lib/ScenarioPlayer.js'
// import TextData from './lib/TextDataA.json.js'
// import TextData from './lib/TextDataZeroDay.json.js'
import TextData from './lib/scenario_data.json' assert { type: "json" }
import FrameSizing from "./lib/FrameSizing.js"
// import mapItems from "./lib/mapItems.json.js" 
import mapItemsJson from "./lib/mapItems.json" assert { type: "json" }
import { CreateMap } from './lib/map.js'

(function(){
    const gameState = {
        textEventId: -1, // いらない
        nowPart: undefined,
        FloatCheck: true,
        nowDate: 0,
        eventState: 'title',
        autoPlayingFlag: false, // いらない
        TextPlayer: undefined
    }
    let TextPlayer
    const TextPlayerList = []
    
    window.addEventListener('resize', FrameSizing)

    window.addEventListener('load',(e)=>{

        document.oncontextmenu = () => {return false}

        FrameSizing()

        // 伝搬チェック用
        // document.querySelectorAll('*').forEach(element => {
        //     element.addEventListener('click',e=>{
        //         console.log(e.target)
        //     })
        // });

        CreateMap(gameState)

        // // マップアイテムの生成
        // gameState.eventState = 'map'
        // const eleFragment = document.createDocumentFragment()
        // // シナリオ格納
        // const mapItems = mapItemsJson[gameState.nowPart ?? 'A0']
        // for (const itemId in mapItems) {
        //     if (Object.hasOwnProperty.call(mapItems, itemId)) {
        //         const item = mapItems[itemId]
        //         const itemEle = document.createElement('div')
        //         itemEle.id = itemId
        //         itemEle.className = 'map-touch'
        //         itemEle.dataset.place = item.place

        //         // イベント付与
        //         itemEle.addEventListener('click',(e) => {
                
        //             const float = document.getElementById('mapWrapper')
        //             float.classList.remove('none')
        //             const pname = document.getElementById('placeName')
        //             const placeName = e.target.dataset.place
        //             pname.innerHTML = placeName

        //             const partKey = item.partKey
    
        //             const yesBtn = document.getElementById('mapSelectYes')
        //             const noBtn = document.getElementById('mapSelectNo')
    
        //             /**
        //              * 付与するYES/NO選択イベント
        //              * @param {*} e event
        //              */
        //             const selectEve = async(e) => {
        //                 float.classList.add('none')
        //                 e.target.removeEventListener('click',selectEve,false)//クリックされたボタンのイベントを削除
        //                 e.target === yesBtn ? noBtn : yesBtn .removeEventListener('click',selectEve,false)//クリックされなかったボタンのイベントを削除
                        
        //                 const timer = (s) => {
        //                     return new Promise((resolve,reject)=>{
        //                         const timerId = setTimeout(() => {
        //                             // clearTimeout(timerId)
        //                             resolve()
        //                         }, s);
        //                     })
        //                 }
                        
        //                 if( e.target === yesBtn ) { // yesが押された

        //                     // 暗転
        //                     document.getElementById('darkening-floor').classList.remove('op0')
        //                     // タイマー
        //                     await timer(1000);
        //                     // シナリオ画面へ遷移
        //                     document.getElementById('textScreen').classList.remove('none')
        //                     document.getElementById('mapScreen').classList.add('none')
        //                     // タイマー
        //                     await timer(1000);
        //                     // 暗転解除
        //                     document.getElementById('darkening-floor').classList.add('op0')
                            
        //                     console.log(TextData[partKey]);//選択されたシナリオ

        //                     gameState.textEventId++;
        //                     gameState.nowPart = partKey
        //                     TextPlayer = new ScenarioPlayer(TextData[partKey], gameState)//プレイヤー生成
                            
        //                     // TextPlayerList[gameState.textEventId]=new ScenarioPlayer(TextData[partKey],gameState)//プレイヤー生成
        //                     // console.log(gameState);
        //                     // console.log(TextPlayerList);
                            
        //                     /*------------------
        //                         テキストの処理 
        //                     ------------------*/
                            
        //                 }
                    

        //             }
    
        //             yesBtn.addEventListener('click',selectEve,false)
        //             noBtn.addEventListener('click',selectEve,false)
        //         })

        //         // スタイル付与
        //         const styles = item.style
        //         for (const prop in styles) {
        //             if (Object.hasOwnProperty.call(styles, prop)) {
        //                 const val = styles[prop]
        //                 itemEle.style[prop] = val
        //             }
        //         }

        //         // フラグメントにappend
        //         eleFragment.appendChild(itemEle)
        //     }
        // }
        // // DOMにappend
        // document.getElementById('mapItems').appendChild(eleFragment)

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
            if(!TextCover.classList.contains('none')) return
            if (gameState.FloatCheck) {
                gameState.FloatCheck = false
                FloatCheck.children[0].innerHTML = 'OFF'
                TextFloat.classList.add('op0')
            }else{
                gameState.FloatCheck = true
                FloatCheck.children[0].innerHTML = 'ON'
                TextFloat.classList.remove('op0')
            }
            // console.log(FloatCheck);
            // console.log(gameState.FloatCheck)
        })

        let floatSpbTextList = [
            'Tips:黒い四角の範囲が選択できます',
            'どこへ行こう？',
            '上の方かな？',
            '下でもあり',
        ]
        let floatSpbTextCount = 0
        // マップ②の画面下のテキスト処理
        const floatSpb = document.getElementById('FloatSpeechBubble')
        const floatSpbText = document.querySelector('#FloatSpeechBubble .textarea')
        // console.log(floatSpbText);
        floatSpbText.innerHTML = floatSpbTextList[floatSpbTextCount]
        floatSpbText.addEventListener('click', e => {
            // console.log(e.target.innerHTML);
            floatSpbTextCount++
            if (floatSpbTextCount >= floatSpbTextList.length) floatSpbTextCount = 0
            e.target.innerHTML = floatSpbTextList[floatSpbTextCount]
        })


        /**
         * 日付の設定
         */
        const setDate = () => {
            // 日付の設定
            document.querySelector('#date > p').innerHTML = `${gameState.nowDate}日目`
        }

        setDate()


    })
})()