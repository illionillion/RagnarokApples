"use strict";
import TextAnimation  from './lib/TextAnimation.js';

(function(){
    // console.log('hello');



    window.addEventListener('load',(e)=>{

        let gameState = {
            "title":true,
            "textloading":false,
            "msgindex":0
        }
        let msgs = [
            "今日のご飯は",
            "焼肉に行こうと思ったがお金がなかったので、自炊することにした。",
            "冷蔵庫を見た。",
            "何も食べれそうなものがなかった。あったのは調味料とビールだけ…。",
            "「こりゃ、ダメだな...笑」",
            "俺はそうつぶやいて、近所のスーパーへ出かけること決意した。",
            "顔を洗い、髭を剃り、歯を磨いて、…。それから着替え、身支度を済ませてドアを開けた。"
        ]
        function TextLoading() {
            if (gameState.msgindex>=msgs.length) {
                alert('終了');
                return;
            }
            const msgfragment = document.createDocumentFragment();
            for (let i = 0; i < msgs[gameState.msgindex].length; i++) {
                const element = msgs[gameState.msgindex][i];
                const span = document.createElement('span');
                span.innerText=element;
                span.className='op0';
                msgfragment.appendChild(span);
            }
            document.getElementById('dialogue').innerHTML='';
            document.getElementById('dialogue').appendChild(msgfragment);
            gameState.msgindex++;
    
        }

        const screen = document.getElementById('screen');
        screen.addEventListener('click',(e)=>{

            if (gameState.title) {
                gameState.title=false;
                document.querySelector('#screen .msg-txt').classList.add('none');
                TextLoading();

            }else{
                // if (!gameState.textloading) {
                //     gameState.textloading=true;

                //     // console.log(msgs[gameState.msgindex]);

                //     TextLoading();

                // }else{


                    let text = document.querySelectorAll('#dialogue .op0');
                    if (text.length==0) {
                        TextLoading();
                        // console.log(text);
                        text = document.querySelectorAll('#dialogue .op0');
                    }
                    const AnimeC = new TextAnimation(text)
                    // console.log(text);
                    AnimeC.AnimationStart(text);
                // }
            }
        
        })
    })
})();