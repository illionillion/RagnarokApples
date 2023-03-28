export const getCharacterPath = async () => {
    return await window.myAPI.getAssetsPath() + 'character'
}
export const getBackgroundPath = async () => {
    return await window.myAPI.getAssetsPath() + 'background'
}
export const getAudioPath = async () => {
    return await window.myAPI.getAssetsPath() + 'audio'
}