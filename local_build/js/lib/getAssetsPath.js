const getCharacterPath = async () => {
    return await window.myAPI.getAssetsPath() + 'character'
}
const getBackgroundPath = async () => {
    return await window.myAPI.getAssetsPath() + 'background'
}
const getAudioPath = async () => {
    return await window.myAPI.getAssetsPath() + 'audio'
}

exports.getAudioPath = getAudioPath
exports.getCharacterPath = getCharacterPath
exports.getBackgroundPath = getBackgroundPath