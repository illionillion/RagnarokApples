export default function FrameSizing(){
    // console.log('size');

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる

    const ScreenWidth = window.innerWidth
    console.log(ScreenWidth);
    const windowHeight = window.innerHeight
    const Height = 9 * ScreenWidth / 16 
    const ScreenHeight = Height > windowHeight ? windowHeight : Height
    console.log(ScreenHeight);
    console.log(window.innerHeight);
    document.getElementById('frame').style.height=`${ScreenHeight}px`
}