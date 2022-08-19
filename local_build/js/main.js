"use strict"
import FrameSizing from "./lib/FrameSizing.js"
import { CreateMap } from './lib/map.js'
import toDarking from './lib/toDarking.js'

(function(){
    const gameState = {
        textEventId: -1, // いらない
        nowPart: 'A0',
        FloatCheck: true,
        nowDate: 0,
        eventState: 'title',
        autoPlayingFlag: false, // いらない
        TextPlayer: undefined,
        screenDarking: false, //暗転中か
    }

    window.addEventListener('resize', FrameSizing)

    window.addEventListener('load', async (e)=>{

        document.addEventListener('contextmenu', () => {return false})

        FrameSizing()

        // 伝搬チェック用
        // document.querySelectorAll('*').forEach(element => {
        //     element.addEventListener('click',e=>{
        //         console.log(e.target)
        //     })
        // });

        await toDarking(async e => {

            await CreateMap(gameState)
            // マップ画面遷移系
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

            /**
             * 日付の設定
             */
            const setDate = () => {
                // 日付の設定
                document.querySelector('#date > p').innerHTML = `${gameState.nowDate}日目`
            }

            setDate()

        }, gameState)

    })
})()