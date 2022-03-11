export default function FrameSizing(){
    // console.log('size');

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる

    let ScreenWidth = window.screen.width
    console.log(ScreenWidth);

    let ScreenHeight = 9 * ScreenWidth / 16
    document.getElementById('frame').style.minWidth=`${ScreenWidth}px`
    document.getElementById('frame').style.height=`${ScreenHeight}px`
}