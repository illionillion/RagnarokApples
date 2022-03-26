"use strict";
import ScenarioPlayer from './lib/ScenarioPlayer.js';
// import TextDataA from './lib/TextDataA.json.js';
import TextDataA from './lib/TextDataZeroDay.json.js';
import FrameSizing from './lib/FrameSizing.js';

(function(){
    let gameState = {
        "title":true,
        "textloading":false,
        // "msgindex":0,
        "dialogue":true,
        // "autoPlaying":true
        "autoPlaying":false,
        "autoPlayingCheck":false,
        "onePictureSwitch":false
    }
    
    window.addEventListener('resize',(e)=>{
        FrameSizing()
    })
    window.addEventListener('load',(e)=>{
        FrameSizing()

        // console.log(TextDataA);
        // console.log(TextDataA.A1);
        // console.log(Object.keys(TextDataA.A1));
        // console.log(Object.keys(TextDataA.A1).length);
    
        // TextDataA.A1これで投げ込む
        // let TextData = new Text(msgs,gameState)
        let TextData = new ScenarioPlayer(TextDataA.A1,gameState)
    
        const screen = document.getElementById('screen');
        const dialogue = document.getElementById('dialogue');
        const dialogueText = document.getElementById('dialogue-text-area');
        const autocheck = document.getElementById('autocheck');
        const darkeningFloor = document.getElementById('darkening-floor');
        const onePicture = document.getElementById('one-picture');

        const ScenarioClick = () => {
            let text = gameState.onePictureSwitch ? document.querySelectorAll('#one-picture-text .op0') : document.querySelectorAll('#dialogue-text-area .op0');

            if (text.length===0 && !gameState.autoPlaying) {
                TextData.Loading();
                // console.log(text);
                text = gameState.onePictureSwitch ? document.querySelectorAll('#one-picture-text .op0') : document.querySelectorAll('#dialogue-text-area .op0');
            }
            if (!TextData.movingFlag) {
                // gameState.autoPlayingCheckでautoの待機中にイベントが発生するのを防ぐ
                console.log(gameState.autoPlaying);
                console.log(gameState.autoPlayingCheck);
                if (gameState.autoPlaying && gameState.autoPlayingCheck) {
                    console.log('cancel');//autoの待機中にイベントが発生するのを防ぐ
                    return;
                }else if(gameState.autoPlaying && !gameState.autoPlayingCheck){
                    gameState.autoPlayingCheck=true;//auto初回のみ通る
                }
                TextData.AnimationStart(text);
            }else{
                    
                TextData.AnimationForcedEnd(text);

            }
        }
    
        // テキストボックス以外をクリックすると、テキストボックスが消えたり現れたりする
        screen.addEventListener('click',(e)=>{
            if (gameState.dialogue) {
                dialogue.classList.add('none');
                autocheck.classList.add('none');
                gameState.dialogue=false;
                // TextData.movingFlag = false;//アニメーション停止
                TextData.AnimationPause();
            }else{
                dialogue.classList.remove('none');
                autocheck.classList.remove('none');
                gameState.dialogue=true;
                // TextData.AnimationRestart();
            }
            // console.log(gameState.dialogue);
        })
    
        // テキストボックスクリックでアニメーション再生
        dialogue.addEventListener('click',(e)=>{
            e.stopPropagation();//イベントの伝搬を防止
            if (gameState.title) {
                gameState.title=false;
                document.querySelector('#screen .msg-txt').classList.add('none');
                TextData.Loading();
            }else{
                ScenarioClick();
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
        // 暗転要素の伝搬禁止
        darkeningFloor.addEventListener('click',(e)=>{
            e.stopPropagation();
        })
        // 一枚絵の時のイベント発火
        onePicture.addEventListener('click',(e)=>{
            e.stopPropagation();
            ScenarioClick();

        })
    })
})();