"use strict";
import Text from './lib/Text.js';

(function(){
    window.addEventListener('load',(e)=>{

        let gameState = {
            "title":true,
            "textloading":false,
            "msgindex":0,
            "dialogue":true,
            // "autoPlaying":true
            "autoPlaying":false,
            "autoPlayingCheck":false
        }
    
        let msgs = [ //コンストラクタに入れる
            "今日の*/ご飯/*は",
            "焼肉に行こうと思ったが/お金/がなかったので、*自炊*することにした。",
            "冷蔵庫を見た。",
            "何も食べれそうなものがなかった。あったのは調味料とビールだけ…。",
            "「こりゃ、ダメだな...笑」",
            "俺はそうつぶやいて、近所のスーパーへ出かけること決意した。",
            "顔を洗い、髭を剃り、歯を磨いて、…。それから着替え、身支度を済ませてドアを開けた。"
        ]
    
        let TextData = new Text(msgs,gameState)
    
        const screen = document.getElementById('screen');
        const dialogue = document.getElementById('dialogue');
        const autocheck = document.getElementById('autocheck');
    
        // テキストボックス以外をクリックすると、テキストボックスが消えたり現れたりする
        screen.addEventListener('click',(e)=>{
            if (gameState.dialogue) {
                dialogue.classList.add('none');
                autocheck.classList.add('none');
                gameState.dialogue=false;
            }else{
                dialogue.classList.remove('none');
                autocheck.classList.remove('none');
                gameState.dialogue=true;
            }
        })
    
        // テキストボックスクリックでアニメーション再生
        dialogue.addEventListener('click',(e)=>{
            e.stopPropagation();//イベントの伝搬を防止
            if (gameState.title) {
                gameState.title=false;
                document.querySelector('#screen .msg-txt').classList.add('none');
                TextData.Loading();
    
            }else{
    
                let text = document.querySelectorAll('#dialogue .op0');

                if (text.length===0 && !gameState.autoPlaying) {
                    TextData.Loading();
                    // console.log(text);
                    text = document.querySelectorAll('#dialogue .op0');
                }
                if (!TextData.movingFlag) {
                    // gameState.autoPlayingCheckでautoの待機中にイベントが発生するのを防ぐ
                    console.log(gameState.autoPlaying);
                    console.log(gameState.autoPlayingCheck);
                    if (gameState.autoPlaying && gameState.autoPlayingCheck) {
                        console.log('cancel');
                        return;
                    }else if(gameState.autoPlaying && !gameState.autoPlayingCheck){
                        gameState.autoPlayingCheck=true;
                    }
                    TextData.AnimationStart(text);
                }else{
                    // if (!gameState.autoPlaying) {
                        
                        TextData.AnimationForcedEnd(text);

                    // }
                }
            }
        
        })

        // AutoのON/OFF
        autocheck.textContent = gameState.autoPlaying ? 'Auto ON' :'Auto OFF';
        autocheck.addEventListener('click',(e)=>{
            e.stopPropagation();
            gameState.autoPlaying=gameState.autoPlaying ? false : true
            e.target.textContent = gameState.autoPlaying ? 'Auto ON' :'Auto OFF';
            // auto機能をONからOFFに変更したときautoPlayingCheckを初期化
            if (!gameState.autoPlaying) {
                gameState.autoPlayingCheck=false;
            }
            //autoで再生中にautoをoffにする時だけ
            if (gameState.autoPlaying && TextData.movingFlag) {
                gameState.autoPlayingCheck=true;
            }
            // console.log(gameState.autoPlaying);
        });
    })
})();