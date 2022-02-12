export default class Text {

    /**
     * 1パートのテキストのデータを格納する
     * @param {*} text テキストのオブジェクト
     * @param {*} state ゲームのステータスのオブジェクト
     */
    constructor(text,state){
        this.text=text
        this.state=state
        this.moving=false;
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
     * テキストを透明にして配置する
     */
    Loading(){

        if (this.state.msgindex>=this.text.length) {
            // alert('終了');
            // return;
            this.state.msgindex=0;
        }
        const msgfragment = document.createDocumentFragment();
        for (let i = 0; i < this.text[this.state.msgindex].length; i++) {
            const element = this.text[this.state.msgindex][i];
            const span = document.createElement('span');
            span.innerText=element;
            span.className='op0';
            msgfragment.appendChild(span);
        }
        document.getElementById('dialogue').innerHTML='';
        document.getElementById('dialogue').appendChild(msgfragment);
        this.state.msgindex++;
    
    }

    /**
     * アニメーション再生
     * @param {*} text cp0クラスがついているspanタグ
     */
    AnimationStart(text){
        const screen = document.getElementById('screen');

        (async()=>{
            this.moving=true;
            for (const ele of text) {
                if (!this.moving) {
                    // console.log("stop");
                    break;
                }

                await this.timer(100);
                // console.log(ele);
                ele.classList.remove('op0');

            }
            this.moving=false;
            
        })();
        // this.Loading();
    }

    /**
     * アニメーション再生中に画面タッチがされたら終了させる
     * @param {*} text cp0クラスがついているspanタグ
     */ 
    AnimationForcedEnd(text){
        text.forEach(element => {
            element.classList.remove('op0');
            this.moving=false;

        });
    }

}