export default function FrameSizing() {
  // console.log('size');

  //PC画面の幅を取得してから16:9で計算
  //縦のサイズを割り当てる

  let ScreenWidth = document.documentElement.clientWidth;
  let ScreenHeight = (9 * ScreenWidth) / 16;
  const windowHeight = document.documentElement.clientHeight;
  let g = gcd(ScreenHeight, ScreenWidth);

  if (ScreenHeight > windowHeight) {
    ScreenHeight = windowHeight;
    ScreenWidth = (16 * ScreenHeight) / 9;
    g = gcd(ScreenWidth, ScreenHeight);
    console.log("hoge");
  }

  // 最大公約数を求める
  function gcd(w, h) {
    if (h === 0) return w;
    return gcd(h, w % h);
  }

  

  // ここで比率を出したい // 2つの値の最大公約数を求めてそれで割る
  // console.log(`${ScreenWidth} : ${ScreenHeight}`);
  console.log(`${ScreenWidth / g} : ${ScreenHeight / g}`);

  document.getElementById("frame").style.width = `${ScreenWidth}px`;
  document.getElementById("frame").style.height = `${ScreenHeight}px`;
}
