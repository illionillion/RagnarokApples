const menuFrame = document.getElementById("menu-frame");
const menuOpenButton = document.getElementById("map-menu-btn");
const menuCloseButton = document.getElementById("menu-close-button");
/**
 * メニュー初期化
 */
export const initMenu = () => {
    menuOpenButton.addEventListener('click', openMenuScreen)
    menuCloseButton.addEventListener('click', closeMenuScreen)
}

/**
 * メニュー起動
 */
export const openMenuScreen = () => {
    menuFrame.classList.remove("hide");
}

/**
 * メニュー終了
 */
export const closeMenuScreen = () => {
    menuFrame.classList.add("hide");
}