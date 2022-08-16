const { ipcRenderer } = require('electron')
// console.log('ok');
window.addEventListener('load', () => {

    document.addEventListener('contextmenu', () => {return false})

    ipcRenderer.on('loadingData', (event, arg) => {//受け取り

        document.getElementById('percent').innerText = `${arg} %`
        document.getElementById('loading').value = arg
        if(arg == 100) document.querySelector('label>h1').innerText = 'Completed!'
        
    })

})