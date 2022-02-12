"use strict";
import Text from './lib/Text.js';

(function(){

    let gameState = {
        "title":true,
        "textloading":false,
        "msgindex":0
    }

    let msgs = [ //コンストラクタに入れる
        "今日のご飯は",
        "焼肉に行こうと思ったがお金がなかったので、自炊することにした。",
        "冷蔵庫を見た。",
        "何も食べれそうなものがなかった。あったのは調味料とビールだけ…。",
        "「こりゃ、ダメだな...笑」",
        "俺はそうつぶやいて、近所のスーパーへ出かけること決意した。",
        "顔を洗い、髭を剃り、歯を磨いて、…。それから着替え、身支度を済ませてドアを開けた。"
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
            if (!TextData.moving) {
                TextData.AnimationStart(text);
            }else{
                TextData.AnimationForcedEnd(text);
            }
        }
    
    })
})();