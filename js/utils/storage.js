import { NAMESPACE, MESSAGE } from '../Constants.js'

export const storage = {
    /**
     * localstorage 호출
     * @param {String} key : NAMESPACE 상수를 prefix로 가지는 localStorage key
     */
    get: function (key) {
        //용량, 권한 체크
        try {
            const data =
                JSON.parse(localStorage.getItem(`${NAMESPACE}${key}`)) || []

            return data
        } catch (err) {
            console.log(MESSAGE.STORAGE_FAIL)
            return null
        }
    },

    /**
     * localstorage 저장
     * @param {String} key : NAMESPACE 상수를 prefix로 가지는 localStorage key
     * @param {String} value : localstorage value
     */
    set: function (key, value) {
        localStorage.setItem(`${NAMESPACE}${key}`, JSON.stringify([...value]))
    },
}
