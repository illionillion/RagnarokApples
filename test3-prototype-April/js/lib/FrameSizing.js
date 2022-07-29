/**
 * 画面サイズを16:9にフィットさせる関数
 */
export default function FrameSizing(){
    // console.log('size');

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる

    let ScreenWidth = document.documentElement.clientWidth
    let ScreenHeight = 9 * ScreenWidth / 16 
    const windowHeight = document.documentElement.clientHeight
    
    if (ScreenHeight > windowHeight) {

        ScreenHeight = windowHeight
        ScreenWidth = 16 * ScreenHeight / 9

    }

    // ここで比率を出したい // 2つの値の最大公約数を求めてそれで割る
    console.log(`${ScreenWidth} : ${ScreenHeight}`);
    
    document.getElementById('frame').style.width = `${ScreenWidth}px`
    document.getElementById('frame').style.height = `${ScreenHeight}px`
}