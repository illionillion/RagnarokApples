export const TitleInit = () => {
  let index = 0;

  /**
   * @param {KeyboardEvent} e
   */
  const keyDownAllow = (e) => {
    if (e.code == "KeyW" || e.code == "ArrowUp") {
      if (index > 0) index -= 1;
      // console.log(`Up`);
    } else if (e.code == "KeyS" || e.code == "ArrowDown") {
      // console.log(`Down`);
      if (index < 4) index += 1;
    } else if (e.code == "KeyA" || e.code == "ArrowLeft") {
      // console.log(`Left`);
    } else if (e.code == "KeyD" || e.code == "ArrowRight") {
      // console.log(`Right`);
    }

    setAllowCursor();
  };

  /**
   * 十字キーカーソルセット
   */
  const setAllowCursor = () => {
    document
      .querySelectorAll("#title-list ul li")
      [index].classList.add("on-cursor");
    for (let i = 0; i < 5; i++) {
      if (i === index) continue;
      document
        .querySelectorAll("#title-list ul li")
        [i].classList.remove("on-cursor");
    }
  };

  /**
   * @param {number} i
   */
  const clickHandler = (i) => {
    // 既に同じだった場合
    if (index === i) {
        console.log('選択');
    } else {
        index = i;
        setAllowCursor();
    }
  };

  window.addEventListener("keydown", keyDownAllow);
  
  document.addEventListener("contextmenu", () => {
    return false;
  });
  for (let i = 0; i < 5; i++) {
    document
      .querySelectorAll("#title-list ul li")
      [i].addEventListener("click", () => {
        clickHandler(i);
      });
  }

  setAllowCursor();
};
