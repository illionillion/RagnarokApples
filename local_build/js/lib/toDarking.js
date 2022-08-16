import timer from "./timer.js";

/**
 * 暗転処理（3秒暗転）
 * @param {function} func 関数(暗転中にさせたい処理)
 * @param {object} state 
 */
const toDarking = async (func, state) => {
    //暗転
    state.screenDarking = true
    document.getElementById('darkening-floor').classList.remove('op0');//暗転
    await timer(1000)
    // funcがfunctionでない可能性もあるのでそれの処理
    if(func && typeof func === 'function') {
        // 非同期かどうか
        switch (func.constructor.name) {
            case 'Function':
                func()
                break;
            case 'AsyncFunction':
                await func() // 非同期の場合はawaitをつけて実行
                break;
            default:
                break;
        }
        console.log(func.constructor.name);
    } else {
        console.log('not function');
    }
    await timer(1000);
    document.getElementById('darkening-floor').classList.add('op0');//暗転解除
    state.screenDarking = false
    await timer(1000);
}

export default toDarking