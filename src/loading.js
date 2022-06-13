const { ipcRenderer } = require('electron')
// console.log('ok');

window.onload = () => {
    document.body.oncontextmenu = () => {return false}
    
    ipcRenderer.on('loadingData', (event, arg) => {//受け取り
        document.getElementById('percent').innerText = `${arg} %`
        document.getElementById('loading').value = arg
    })

} 