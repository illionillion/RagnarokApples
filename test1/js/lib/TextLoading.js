export default class TextLoading {
    constructor(text,state){
        this.text=text
        this.state=state
    }

    Loading(){

        if (this.state.msgindex>=this.text.length) {
            alert('終了');
            return;
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
}