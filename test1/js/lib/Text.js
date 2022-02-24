export default class Text {

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
        document.getElementById('background').src=url;
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

        this.characterSetting(this.TextList[this.msgindex]['characterList'])
        this.backgroundSetting(this.TextList[this.msgindex]['backgroundImage'])
        
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
        document.getElementById('dialogue-name-area').classList.remove('op0');

        (async()=>{
            this.movingFlag=true;
            for (const ele of text) {
                if (!this.movingFlag) {
                    // console.log("stop");
                    break;
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
                this.Loading();
                const nexttext = document.querySelectorAll('#dialogue-text-area .op0');
                this.AnimationStart(nexttext);
            }
                
        })();
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