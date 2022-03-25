"use strict"
import FrameSizing from "./lib/FrameSizing.js"
import mapItems from "./lib/mapItems.json.js"

(function(){
    const state={
        now:1,
        FloatCheck:true
    }

    // console.log(document.getElementById('screen'))
    window.addEventListener('resize',(e)=>{
        FrameSizing()
    })
    window.addEventListener('load',(e)=>{
        FrameSizing()

        // マップアイテムの生成
        const eleFragment = document.createDocumentFragment()
        for (const itemId in mapItems) {
            if (Object.hasOwnProperty.call(mapItems, itemId)) {
                const item = mapItems[itemId]
                const itemEle = document.createElement('div')
                itemEle.id=itemId
                itemEle.className='map-touch'
                itemEle.dataset.place=item.place

                // イベント付与
                itemEle.addEventListener('click',(e)=>{
                
                    const float=document.getElementById('mapWrapper')
                    float.classList.remove('none')
                    const pname = document.getElementById('placeName')
                    const placeName=e.target.dataset.place
                    pname.innerHTML=placeName
    
                    const yesBtn = document.getElementById('mapSelectYes')
                    const noBtn = document.getElementById('mapSelectNo')
    
                    const selectEve = (e) => {
                        if( e.target === yesBtn ) alert(`${placeName}が選択されました`)
                        float.classList.add('none')
                        e.target.removeEventListener('click',selectEve,false)//クリックされたボタンのイベントを削除
                        e.target === yesBtn ? noBtn : yesBtn .removeEventListener('click',selectEve,false)//クリックされなかったボタンのイベントを削除
                    }
    
                    yesBtn.addEventListener('click',selectEve,false)
                    noBtn.addEventListener('click',selectEve,false)
                })

                // スタイル付与
                const styles = item.style
                for (const prop in styles) {
                    if (Object.hasOwnProperty.call(styles, prop)) {
                        const val = styles[prop]
                        itemEle.style[prop]=val
                    }
                }

                // フラグメントにappend
                eleFragment.appendChild(itemEle)
            }
        }
        // DOMにappend
        document.getElementById('mapItems').appendChild(eleFragment)

        // 画面遷移系
        const spb = document.getElementById('speechBubble')
        const FloatCheck = document.getElementById('FloatCheck')
        const TextFloat = document.getElementById('mapTextFloat')
        const TextCover = document.getElementById('mapTextCover')
        spb.addEventListener('click', (e) => { //1から2へ遷移
            TextCover.classList.add('none')
            FloatCheck.classList.remove('op0')
            TextFloat.classList.remove('op0')
        })

        FloatCheck.addEventListener('click',(e)=>{ //2と3の切り替え 
            if (state.FloatCheck) {
                state.FloatCheck=false
                FloatCheck.innerHTML='OFF'
                TextFloat.classList.add('op0')
            }else{
                state.FloatCheck=true
                FloatCheck.innerHTML='ON'
                TextFloat.classList.remove('op0')
            }
            // console.log(state.FloatCheck)
        })
    })
})()