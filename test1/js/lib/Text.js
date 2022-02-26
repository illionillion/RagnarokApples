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
            // console.log(textEle['characterList']['left']['src']);
            // const charimgele = document.createElement('img');
            // charimgele.src = textEle['characterList']['left']['src'];
            // imgele.addEventListener('load',(e)=>{
            //     imgFragment.appendChild(e.target);
            // })
            // imgFragment.appendChild(imgele);
        }
        // document.getElementById('imageholder').appendChild(imgFragment);
    }

    /**
     * 背景画像設定
     * @param {*} url 
     */
    backgroundSetting (url) {

        // srcを変えるだけだが、切り替えに時間がかかってしまう
        document.getElementById('background').src=url;


        // document.getElementById('background').remove();
        // console.log(document.querySelector(`#imageholder > img:nth-child(${this.msgindex+1})`));
        // // 複製するHTML要素を取得
        // var content_area = document.querySelector(`#imageholder > img:nth-child(${this.msgindex+1})`);

        // // 複製
        // const clone_element = content_area.cloneNode(true);

        // // 複製した要素の属性を編集
        // clone_element.id = "background";

        // // 複製したHTML要素をページに挿入
        // document.getElementById('screen').appendChild(clone_element);

        // const image = document.createElement('img');
        // image.id='background';
        // image.src=document.querySelector(`#imageholder > img:nth-child(${this.msgindex+1})`).src;
        // document.getElementById('screen').appendChild(image);
        // document.getElementById('screen').appendChild(document.querySelector(`#imageholder > img:nth-child(${this.msgindex+1})`));
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

        // this.characterSetting(this.TextList[this.msgindex]['characterList'])
        // this.backgroundSetting(this.TextList[this.msgindex]['backgroundImage'])
        
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
        
        (async()=>{
            
            // console.log(document.getElementById('background').src);
            if (document.getElementById('background').src.indexOf(this.TextList[this.msgindex - 1]['backgroundImage'])===-1) { //画像の変更がある時のみ暗転
                
                document.getElementById('darkening-floor').classList.remove('op0');//暗転
                await this.timer(500);
                document.getElementById('dialogue-name-area').classList.remove('op0');//名前表示
                this.characterSetting(this.TextList[this.msgindex - 1]['characterList']);//キャラ画像反映
                this.backgroundSetting(this.TextList[this.msgindex - 1]['backgroundImage'])//読み込み終了=>画面反映まで暗転させたい
                // 2秒間暗転させる処理書きたい
                await this.timer(1000);
                document.getElementById('darkening-floor').classList.add('op0');//暗転解除
            }else{
                //画像が同じ=>暗転しない場合
                document.getElementById('dialogue-name-area').classList.remove('op0');//名前表示
                this.characterSetting(this.TextList[this.msgindex - 1]['characterList']);//キャラ画像反映
            }
            await this.timer(500);

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