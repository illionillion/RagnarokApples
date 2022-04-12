export default function FrameSizing(){
    // console.log('size');

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる

    let ScreenWidth = window.innerWidth
    console.log(ScreenWidth);
    console.log(document.getElementById('frame').style);
    let ScreenHeight = 9 * ScreenWidth / 16
    // let ScreenHeight = 3 * ScreenWidth / 4
    // let ScreenHeight = 10 * ScreenWidth / 16
    console.log(ScreenHeight);
    document.getElementById('frame').style.height=`${ScreenHeight}px`
}