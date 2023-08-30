export function convert2HanDakuon(moji) {
    const seionKeyObj = {
        'ハ': 'パ',
        'ヒ': 'ピ',
        'フ': 'プ',
        'ヘ': 'ペ',
        'ホ': 'ポ',
        'パ': 'ハ',
        'ピ': 'ヒ',
        'プ': 'フ',
        'ペ': 'ヘ',
        'ポ': 'ホ',
        'バ': 'パ',
        'ビ': 'ピ',
        'ブ': 'プ',
        'ベ': 'ペ',
        'ボ': 'ポ'
    }
    return seionKeyObj[moji]
}