export function convert2HanDakuon(moji) {
    const seionKeyObj = {
        'ハ': 'パ',
        'ヒ': 'ピ',
        'フ': 'プ',
        'ヘ': 'ペ',
        'ホ': 'ポ'
    }
    return seionKeyObj[moji]
}