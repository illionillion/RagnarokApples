export function convert2Dakuon(moji) {
    const seionKeyObj = {
        'カ': 'ガ',
        'キ': 'ギ',
        'ク': 'グ',
        'ケ': 'ゲ',
        'コ': 'ゴ',
        'サ': 'ザ',
        'シ': 'ジ',
        'ス': 'ズ',
        'セ': 'ゼ',
        'ソ': 'ゾ',
        'タ': 'ダ',
        'チ': 'ヂ',
        'ツ': 'ヅ',
        'テ': 'デ',
        'ト': 'ド',
        'ハ': 'バ',
        'ヒ': 'ビ',
        'フ': 'ブ',
        'ヘ': 'ベ',
        'ホ': 'ボ'
    }
    return seionKeyObj[moji]
}

// console.log(convert2Dakuon('ス'));
