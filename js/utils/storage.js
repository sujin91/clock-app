import { NAMESPACE, MESSAGE } from '../constants.js'

export const Storage = {
    get: key => {
        try { //용량, 권한 체크
            const data = JSON.parse(localStorage.getItem(`${NAMESPACE}${key}`)) || []
            return data
        }
        catch (err) {
            console.log(MESSAGE.STORAGE_FAIL)
            return null
        }
    },
    set: (key, value) => localStorage.setItem(`${NAMESPACE}${key}`, JSON.stringify(value)),
}
