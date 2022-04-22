export default function FrameSizing(){
    // console.log('size');

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる

    let ScreenWidth = document.documentElement.clientWidth
    let ScreenHeight = 9 * ScreenWidth / 16 
    const windowHeight = document.documentElement.clientHeight
    console.log(ScreenWidth);
    console.log(ScreenHeight);
    console.log(windowHeight);
    if (ScreenHeight > windowHeight) {

        ScreenHeight = windowHeight
        ScreenWidth = 16 * ScreenHeight / 9 
    }
    document.getElementById('frame').style.width = `${ScreenWidth}px`
    document.getElementById('frame').style.height = `${ScreenHeight}px`
}