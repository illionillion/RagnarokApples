"use strict";
import FrameSizing from "./lib/FrameSizing.js";


(function(){
    const state={
        now:1,
        FloatCheck:true
    }
    // console.log(document.getElementById('screen'));
    window.addEventListener('resize',(e)=>{
        FrameSizing()
    })
    window.addEventListener('load',(e)=>{
        FrameSizing()
        const point_eles = document.getElementsByClassName('map-touch')
        // console.log(point_eles);
        for (const point of point_eles) { //各場所のタッチ時の処理
            // console.log(point);
            point.addEventListener('click',(e)=>{
                
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

        }

        const spb = document.getElementById('speechBubble')
        const FloatCheck = document.getElementById('FloatCheck')
        const TextFloat = document.getElementById('mapTextFloat')
        const TextCover = document.getElementById('mapTextCover')
        spb.addEventListener('click', (e) => {
            TextCover.classList.add('none')
            FloatCheck.classList.remove('op0');
            TextFloat.classList.remove('op0');
        })

        FloatCheck.addEventListener('click',(e)=>{
            if (state.FloatCheck) {
                state.FloatCheck=false
                FloatCheck.innerHTML='OFF'
                TextFloat.classList.add('op0');
            }else{
                state.FloatCheck=true
                FloatCheck.innerHTML='ON'
                TextFloat.classList.remove('op0');
            }
            console.log(state.FloatCheck);
        })
    })
})();