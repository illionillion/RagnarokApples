"use strict";
import FrameSizing from "./lib/FrameSizing.js";

(function(){
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
                // console.log(e.target);
                // alert(e.target.dataset.place);
                const float=document.getElementById('mapSelectFloat')
                float.classList.remove('none')
                const pname = document.getElementById('placeName')
                pname.innerHTML=e.target.dataset.place

                const noBtn = document.getElementById('mapSelectNo')
                noBtn.addEventListener('click',((e)=>{
                    const f = (e) => {
                        // console.log('a');//イベントが消えないので繰り返すごとにたくさん走る
                        float.classList.add('none')
                        // noBtn.removeEventListener('click',f,false)
                        e.target.removeEventListener('click',f,false)//イベントの削除
                    }
                    return f
                })(),false)
            })

        }
    })
})();