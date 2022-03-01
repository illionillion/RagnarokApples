export default class TextAnimation{
    constructor(textlist){
        this.textlist=textlist;
        this.moving=false;
    }

    // timer
    timer(s){
        return new Promise((resolve,reject)=>{
            setTimeout(() => {
                resolve();
            }, s);
        })
    }

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
                screen.addEventListener("click",(e)=>{
                    if (this.moving) {
                        // console.log(this);
                        // console.log(e);
                        text.forEach(element => {
                            element.classList.remove('op0');
                        });
                        // ScriptProcessorNode();
                        this.moving=false;
                        return;
                    }
                })
            }
            this.moving=false;
            
        })();
    }

}
