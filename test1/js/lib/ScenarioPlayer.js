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

        this.imagePreload();
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
        document.getElementById('background').src=url;

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
            // return;
            this.msgindex=0;
        }
        console.log(this.TextList[this.msgindex]);
        
        const msgfragment = document.createDocumentFragment();

        let speakerName = this.TextList[this.msgindex]['characterText']['name'];//名前
        for (let i = 0; i < this.TextList[this.msgindex]['characterText']['text'].length; i++) {
            const element = this.TextList[this.msgindex]['characterText']['text'][i];
            if (element==='/') {
                // console.log(element);
                if (this.colorFlag) {
                    this.colorFlag=false;
                    continue;
                }
                this.colorFlag=true;
                continue;
            }
            if (element==='*') {
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
            }
            msgfragment.appendChild(span);
        }
        this.colorFlag=false;

        //一枚絵の時
        if (this.TextList[this.msgindex]['onePicture']) {
            // #onePictureに操作
            console.log(this.TextList[this.msgindex]);
        }else{

        }

        document.getElementById('dialogue-name-area').classList.add('op0');
        document.getElementById('dialogue-name-area').innerHTML=speakerName;
        document.getElementById('dialogue-text-area').innerHTML='';
        document.getElementById('dialogue-text-area').appendChild(msgfragment);
        
        this.msgindex++;
    
    }

    /**
     * アニメーション再生
     * @param {*} text cp0クラスがついているspanタグ
     */
    AnimationStart(text){
        this.nowEle = text;
        (async()=>{
            
            // console.log(document.getElementById('background').src);
            if (document.getElementById('background').src.indexOf(this.TextList[this.msgindex - 1]['backgroundImage'])===-1) { //画像の変更がある時のみ暗転
                
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
            for (const ele of text) {
                if (!this.movingFlag) {
                    // console.log("stop");
                    if (!this.state.dialogue) {
                        this.state.autoPlayingCheck=false;
                        // console.log('');
                        return;//オートで再生中にダイアログ非表示で停止させた場合
                    }else{
                        break;
                    }
                }
                if (!this.state.dialogue) {
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
            
            //オート機能を作りたいが難しい
            if (this.state.autoPlaying) {

                await this.timer(1000);//この待機中にAnimationStartが走るとおかしくなる
                // console.log('auto');
                // console.log(text);
                if (!this.state.dialogue) {
                    this.state.autoPlayingCheck=false;
                    return;
                }
                this.Loading();
                const nexttext = document.querySelectorAll('#dialogue-text-area .op0');
                this.AnimationStart(nexttext);
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