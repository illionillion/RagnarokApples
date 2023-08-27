export function convert2Komoji(moji) {
    const seionKeyObj = {
        'ア': 'ァ',
        'イ': 'ィ',
        'ウ': 'ゥ',
        'エ': 'ェ',
        'オ': 'ォ',
        'ツ': 'ッ',
        'ヤ': 'ャ',
        'ユ': 'ュ',
        'ヨ': 'ョ',
        'ァ': 'ア',
        'ィ': 'イ',
        'ゥ': 'ウ',
        'ェ': 'エ',
        'ォ': 'オ',
        'ッ': 'ツ',
        'ャ': 'ヤ',
        'ュ': 'ユ',
        'ョ': 'ヨ'
    }
    return seionKeyObj[moji]
}