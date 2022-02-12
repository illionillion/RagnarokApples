"use strict";
import Text from './lib/Text.js';

(function(){

    let gameState = {
        "title":true,
        "textloading":false,
        "msgindex":0
    }

    let msgs = [ //コンストラクタに入れる
        "今日の/ご飯/は",
        "/焼肉に行こうと思った/がお金がなかったので、/自炊することにした。/",
        "冷蔵庫を見た。",
        "何も/食/べれ/そ/うなものがなかった。/あった/のは調/味料とビー/ルだけ…。",
        "「こり/ゃ、ダメだ/な...笑」",
        "俺はそうつぶやいて、近所の/スーパー/へ出かけること/決意/した。",
        "顔を洗/い、髭を/剃り、歯を磨/いて、…/。それか/ら着/替/え/、身支度/を/済ま/せて/ドア/を/開/け/た。"
    ]

    let TextData = new Text(msgs,gameState)

    const screen = document.getElementById('screen');
    screen.addEventListener('click',(e)=>{

        if (gameState.title) {
            gameState.title=false;
            document.querySelector('#screen .msg-txt').classList.add('none');
            TextData.Loading();

        }else{

            let text = document.querySelectorAll('#dialogue .op0');
            if (text.length===0) {
                TextData.Loading();
                // console.log(text);
                text = document.querySelectorAll('#dialogue .op0');
            }
            if (!TextData.movingFlag) {
                TextData.AnimationStart(text);
            }else{
                TextData.AnimationForcedEnd(text);
            }
        }
    
    })
})();