export default class ScenarioPlayer {

    /**
     * 1パートのテキストのデータを格納する
     * @param {*} TextList テキストのオブジェクト
     * @param {*} state ゲームのステータスのオブジェクト
     */
    constructor(TextList,state){
        this.TextList=TextList
        this.state=state
        this.msgindex=0;
        this.movingFlag=false;
        this.colorFlag=false;
        this.sizeFlag=false;
        this.nowEveId = state.textEventId
        this.imagePreload();
        this.init()
    }

    /**
     * イベントの設定
     */
    init(){

        // テキストのパーツ
        const screen = document.getElementById('screen');
        const dialogue = document.getElementById('dialogue');
        const dialogueText = document.getElementById('dialogue-text-area');
        const autocheck = document.getElementById('autocheck');
        const darkeningFloor = document.getElementById('darkening-floor');
        const onePicture = document.getElementById('one-picture');
        
        dialogueText.innerHTML=''
        document.getElementById('one-picture-text').innerHTML='';
        document.getElementById('dialogue-name-area').innerHTML='';
        this.state.autoPlaying=false
        this.state.autoPlayingCheck=false
        this.state.title=true;
        // document.querySelector('#screen .msg-txt').classList.remove('none');


        const ScenarioClick = () => {
            let text = this.state.onePictureSwitch ? document.querySelectorAll('#one-picture-text .op0') : document.querySelectorAll('#dialogue-text-area .op0');

            if (text.length===0 && !this.state.autoPlaying) {
                this.Loading();
                // console.log(text);
                text = this.state.onePictureSwitch ? document.querySelectorAll('#one-picture-text .op0') : document.querySelectorAll('#dialogue-text-area .op0');
            }
            if (!this.movingFlag) {
                // this.state.autoPlayingCheckでautoの待機中にイベントが発生するのを防ぐ
                console.log(this.state.autoPlaying);
                console.log(this.state.autoPlayingCheck);
                if (this.state.autoPlaying && this.state.autoPlayingCheck) {
                    console.log('cancel');//autoの待機中にイベントが発生するのを防ぐ
                    return;
                }else if(this.state.autoPlaying && !this.state.autoPlayingCheck){
                    this.state.autoPlayingCheck=true;//auto初回のみ通る
                }
                this.AnimationStart(text);
            }else{
                    
                this.AnimationForcedEnd(text);

            }
        }
    

        // テキストボックス以外をクリックすると、テキストボックスが消えたり現れたりする
        const textBoxShowHide = () => {
            if (this.state.textEventId!=this.nowEveId) {
                screen.removeEventListener('click',textBoxShowHide)
                return
            }
            if (this.state.dialogue) {
                // 非表示
                dialogue.classList.add('none');
                autocheck.classList.add('none');
                this.state.dialogue=false;
                // this.movingFlag = false;//アニメーション停止
                this.AnimationPause();
            }else{
                // 表示
                dialogue.classList.remove('none');
                autocheck.classList.remove('none');
                this.state.dialogue=true;
                // this.AnimationRestart();
            }

        }
        screen.addEventListener('click',textBoxShowHide,false)
    
        // テキストボックスクリックでアニメーション再生
        const clickDialogue = e => {
            if (this.state.textEventId!=this.nowEveId) {
                dialogue.removeEventListener('click',clickDialogue)
                return
            }
            e.stopPropagation();//イベントの伝搬を防止
            if (this.state.title) {
                this.state.title=false;//いらない？
                // document.querySelector('#screen .msg-txt').classList.add('none');
                this.Loading();
            }else{
                ScenarioClick();
            }
        }
        dialogue.addEventListener('click',clickDialogue,false)

        // AutoのON/OFF
        const autoToggle = e => {
            if (this.state.textEventId!=this.nowEveId) {
                autocheck.removeEventListener('click',autoToggle)
                return
            }
            e.stopPropagation();
            this.state.autoPlaying=this.state.autoPlaying ? false : true
            e.target.textContent = this.state.autoPlaying ? 'Auto ON' :'Auto OFF';
            // auto機能をONからOFFに変更したときautoPlayingCheckを初期化
            if (!this.state.autoPlaying) {
                this.state.autoPlayingCheck=false;
            }
            //autoで再生中にautoをoffにする時だけ
            if (this.state.autoPlaying && this.movingFlag) {
                this.state.autoPlayingCheck=true;
            }
            // console.log(this.state.autoPlaying);
        }
        autocheck.textContent = this.state.autoPlaying ? 'Auto ON' :'Auto OFF';
        autocheck.addEventListener('click',autoToggle,false);

        // 暗転要素の伝搬禁止
        const darkeningPrev = e => {
            if (this.state.textEventId!=this.nowEveId) {
                darkeningFloor.removeEventListener('click',darkeningPrev)
                return
            }
            e.stopPropagation();
        }
        darkeningFloor.addEventListener('click',darkeningPrev,false)

        // 一枚絵の時のイベント発火
        const onePictureClick = e => {
            if (this.state.textEventId!=this.nowEveId) {
                onePicture.removeEventListener('click',onePictureClick)
                return
            }
            e.stopPropagation();
            ScenarioClick();
        }
        onePicture.addEventListener('click',onePictureClick,false)

    }

    /**
     * タイマー処理
     * @param {*} s 遅らせる秒数
     * @returns Promise
     */
    timer(s){
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve();
            }, s);
        })
    }

    /**
     * キャラを設定する
     * @param {*} props 
     */
    characterSetting (props){
        // console.log(props);
        for (const positon in props) {
            if (Object.hasOwnProperty.call(props, positon)) {
                const element = props[positon];
                document.querySelector(`#character-area [data-position=${positon}] img`).src=element.src;
                document.querySelector(`#character-area [data-position=${positon}] img`).alt=element.name;
            }
        }
    }
    /**
     * 背景画像設定
     * @param {*} url 
     */
     backgroundSetting (url) {

        // srcを変えるだけだが、切り替えに時間がかかってしまう
        document.getElementById('textBackground').src=url;

    }
    /**
     * 画像のプリロード
     */
    imagePreload () {
        // const imgFragment = document.createDocumentFragment();
        for (const textEle of this.TextList) {
            // console.log(textEle['backgroundImage']);
            const imgele = document.createElement('img');
            imgele.src = textEle['backgroundImage'];

            for (const key in textEle['characterList']) {
                if (Object.hasOwnProperty.call(textEle['characterList'], key)) {
                    // console.log(textEle['characterList'][key]['src']);
                    const charimgele = document.createElement('img');
                    charimgele.src =  textEle['characterList'][key]['src'];
                    
                }
            }
        }
        // document.getElementById('imageholder').appendChild(imgFragment);
    }

    /**
     * テキストを透明にして配置する
     */
    Loading(){

        if (this.msgindex>=Object.keys(this.TextList).length) {
            // alert('終了');
            // (async ()=>{

            //     console.log("end");
    
            // })
            return;
            // this.msgindex=0;
        }
        console.log(this.TextList[this.msgindex]);
        
        const msgfragment = document.createDocumentFragment();
        let largeHolder;

        let speakerName = this.TextList[this.msgindex]['characterText']['name'];//名前
        for (let i = 0; i < this.TextList[this.msgindex]['characterText']['text'].length; i++) {
            const element = this.TextList[this.msgindex]['characterText']['text'][i];
            if (element==='/') {//赤文字
                // console.log(element);
                if (this.colorFlag) {
                    this.colorFlag=false;
                    continue;
                }
                this.colorFlag=true;
                continue;
            }
            if (element==='*') {//大文字
                // console.log(element);
                if (this.sizeFlag) {
                    this.sizeFlag=false;
                    continue;
                }
                this.sizeFlag=true;
                continue;
            }
            const span = document.createElement('span');
            span.textContent=element;
            span.className='op0';
            if (this.colorFlag) {
                span.classList.add('red');
            }
            if (this.sizeFlag) {
                span.classList.add('large');
                if (!largeHolder) {
                    largeHolder=document.createElement('span');
                    largeHolder.className='fast-show';
                }
                // 一枚絵且つ、大文字の時は速めに表示させるので別にする
                if (this.TextList[this.msgindex]['onePicture']) {
                    largeHolder.appendChild(span);
                    console.log(largeHolder);
                    continue;
                }
            }
            if (largeHolder) {
                msgfragment.appendChild(largeHolder);
            }
            largeHolder=null;
            msgfragment.appendChild(span);
        }
        this.colorFlag=false;

        //一枚絵の時
        if (this.TextList[this.msgindex]['onePicture']) {
            this.state.onePictureSwitch=true;
            // #onePictureに操作
            document.getElementById('one-picture').classList.remove('op0');
            document.getElementById('dialogue').classList.add('op0');
            document.getElementById('one-picture-text').innerHTML='';
            document.getElementById('one-picture-text').appendChild(msgfragment);
            console.log(this.TextList[this.msgindex]);
        }else{
            this.state.onePictureSwitch=false;
            document.getElementById('one-picture').classList.add('op0');
            document.getElementById('dialogue').classList.remove('op0');
            document.getElementById('dialogue-name-area').classList.add('op0');
            document.getElementById('dialogue-name-area').innerHTML=speakerName;
            document.getElementById('dialogue-text-area').innerHTML='';
            document.getElementById('dialogue-text-area').appendChild(msgfragment);
        }
        
        this.msgindex++;
    
    }

    /**
     * アニメーション再生
     * @param {*} text cp0クラスがついているspanタグ
     */
    AnimationStart(text){
        this.nowEle = text;
        (async()=>{
            
            if (document.getElementById('textBackground').src.indexOf(this.TextList[this.msgindex - 1]['backgroundImage'])===-1) { //画像の変更がある時のみ暗転
                
                document.getElementById('autocheck').classList.add('op0');
                document.getElementById('darkening-floor').classList.remove('op0');//暗転
                await this.timer(500);
                document.getElementById('dialogue-name-area').classList.remove('op0');//名前表示
                this.characterSetting(this.TextList[this.msgindex - 1]['characterList']);//キャラ画像反映
                this.backgroundSetting(this.TextList[this.msgindex - 1]['backgroundImage'])//読み込み終了=>画面反映まで暗転させたい
                // 2秒間暗転させる処理書きたい
                await this.timer(1000);
                document.getElementById('darkening-floor').classList.add('op0');//暗転解除
                document.getElementById('autocheck').classList.remove('op0');
                await this.timer(1000);
            }else{
                //画像が同じ=>暗転しない場合
                document.getElementById('dialogue-name-area').classList.remove('op0');//名前表示
                this.characterSetting(this.TextList[this.msgindex - 1]['characterList']);//キャラ画像反映
            }

            // テキスト1文字ずつ描画
            this.movingFlag=true;
            const p = new Promise((resolve,reject)=>{
                (async ()=>{
                    let fastFlag = false;
                    for (const ele of text) {
                        if (!this.movingFlag) {
                            // console.log("stop");
                            if (!this.state.dialogue) {
                                this.state.autoPlayingCheck=false;
                                // console.log('');
                                return;//オートで再生中にダイアログ非表示で停止させた場合
                            }else{
                                break;//テキスト強制終了でautoで次へい行かせる
                            }
                        }
                        if (!this.state.dialogue && !this.state.onePictureSwitch) {
                            this.state.autoPlayingCheck=false;
                            this.movingFlag=false;
                            // console.log('');
                            return;//オートで再生中にダイアログ非表示で停止させた場合
                        }
                        await this.timer(10)
                        if (ele.parentNode.classList.contains('fast-show')) {//1枚絵の時だけ先行して別速度で表示させる
                            fastFlag=true;
                            ele.classList.remove('op0');
                            await this.timer(100)
                        }else{
                            if (fastFlag) {
                                await this.timer(500)
                                fastFlag=false;
                            }
                        }
                    }
                })()
                resolve();
            })
            for (const ele of text) {
                if (!this.movingFlag) {
                    // console.log("stop");
                    if (!this.state.dialogue) {
                        this.state.autoPlayingCheck=false;
                        // console.log('');
                        return;//オートで再生中にダイアログ非表示で停止させた場合
                    }else{
                        break;//テキスト強制終了でautoで次へい行かせる
                    }
                }
                if (!this.state.dialogue && !this.state.onePictureSwitch) {
                    this.state.autoPlayingCheck=false;
                    this.movingFlag=false;
                    // console.log('');
                    return;//オートで再生中にダイアログ非表示で停止させた場合
                }
                if(!ele.classList.contains('op0')){//アニメーション再スタート時op0持ってない場合は飛ばす
                    continue;
                }
                await this.timer(100);
                // console.log(ele);
                ele.classList.remove('op0');

            }
            this.movingFlag=false;

            const toMap = () => {
                (async ()=>{

                    console.log("end");

                    
                    // 暗転
                    document.getElementById('darkening-floor').classList.remove('op0')
                    // タイマー
                    await this.timer(1000);
                    // シナリオ画面へ遷移
                    document.getElementById('textScreen').classList.add('none')
                    document.getElementById('mapScreen').classList.remove('none')
                    document.getElementById('textBackground').src='images/background/concept.png'
                    document.querySelector('#character-left img').src='images/character/transparent_background.png'
                    document.querySelector('#character-center img').src='images/character/transparent_background.png'
                    document.querySelector('#character-right img').src='images/character/transparent_background.png'
                    // タイマー
                    await this.timer(1000);
                    // 暗転解除
                    document.getElementById('darkening-floor').classList.add('op0')

                })()

            }
            
            const nextFlag = this.msgindex >= Object.keys(this.TextList).length
            //オート機能を作りたいが難しい
            if (this.state.autoPlaying) {

                await this.timer(1000);//この待機中にAnimationStartが走るとおかしくなる
                console.log('auto');
                // console.log(text);
                if (!this.state.dialogue && !this.state.onePictureSwitch) {
                    this.state.autoPlayingCheck=false;
                    return;
                }
                this.Loading();
                const nexttext = this.state.onePictureSwitch ? document.querySelectorAll('#one-picture-text .op0') : document.querySelectorAll('#dialogue-text-area .op0');
                if(!nextFlag) {
                    this.AnimationStart(nexttext);
                }else{

                    toMap()
                    
                }

            }else{
                if (nextFlag) toMap()
            }
                
        })();
    }

    AnimationPause () {
        this.movingFlag=false;
    }

    AnimationRestart () {
        // console.log(this.nowEle);
        if (this.movingFlag) {
            return;
        }
        this.AnimationStart(this.nowEle);
    }

    /**
     * アニメーション再生中に画面タッチがされたら終了させる
     * @param {*} text cp0クラスがついているspanタグ
     */ 
    AnimationForcedEnd(text){
        text.forEach(element => {
            element.classList.remove('op0');
            this.movingFlag=false;

        });
    }

}