export function convert2Komoji(moji) {
    const seionKeyObj = {
        'ア': 'ァ',
        'イ': 'イ',
        'ウ': 'ゥ',
        'エ': 'ェ',
        'オ': 'ォ',
        'ツ': 'ッ',
        'ヤ': 'ャ',
        'ユ': 'ュ',
        'ヨ': 'ョ'
    }
    return seionKeyObj[moji]
}