/**
 * ダイアログ起動
 * @param {string} text 
 */
export const openConfirm = (text) => {
    document.getElementById("confirm-dialog-screen").classList.remove("none");
    document.getElementById("confirm-dialog-text").innerHTML = text;
}
/**
 * ダイアログ閉じる
 */
export const closeConfirm = () => {
    document.getElementById("confirm-dialog-screen").classList.add("none");
} 

