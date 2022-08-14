import timer from "./timer.js";

/**
 * 暗転処理（3秒暗転）
 * @param {function} func 関数(暗転中にさせたい処理) async
 * @param {object} state 
 */
const toDarking = async (func, state) => {
    //暗転
    state.screenDarking = true
    document.getElementById('darkening-floor').classList.remove('op0');//暗転
    await timer(1000)
    if(func) await func()
    console.log('func');
    await timer(1000);
    document.getElementById('darkening-floor').classList.add('op0');//暗転解除
    state.screenDarking = false
    await timer(1000);
}

export default toDarking