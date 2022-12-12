/**
 * 画面サイズを16:9にフィットさせる関数
 */
export default function FrameSizing(){

    //PC画面の幅を取得してから16:9で計算
    //縦のサイズを割り当てる
    let ScreenWidth = document.documentElement.clientWidth;
    // 計算して出した縦幅
    let ScreenHeight = (9 * ScreenWidth) / 16;
    // 実際の縦幅
    const windowHeight = document.documentElement.clientHeight;
  
    // 計算した縦幅が実際の縦幅より大きい時
    if (ScreenHeight > windowHeight) {
        ScreenHeight = windowHeight;
        // 計算した横幅を出す // 割り切れない時に誤差発生
        ScreenWidth = (16 * ScreenHeight) / 9;
        console.log("hoge");
    }

    /**
     * 最大公約数を求める
     * @param {number} w 横幅
     * @param {number} h 高さ
     * @returns {number}
     */
    function gcd(w, h) {
        if (h === 0) {
            console.log('計算終了');
            console.log(w);
            return w;
        }
        console.log('計算中');
        return gcd(h, w % h);
    }

    const g = gcd(ScreenWidth, ScreenHeight);

    // ここで比率を出したい // 2つの値の最大公約数を求めてそれで割る
    console.log(`${ScreenWidth} : ${ScreenHeight}`);
    console.log(`${ScreenWidth / g} : ${ScreenHeight / g}`);

    document.getElementById("frame").style.width = `${ScreenWidth}px`;
    document.getElementById("frame").style.height = `${ScreenHeight}px`;
}
