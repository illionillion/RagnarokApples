/**
 * タイマー処理
 * @param {Number} s 遅らせる秒数
 * @returns Promise
 */
const timer = s => {
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      resolve();
    }, s);
  });
};

export default timer;
