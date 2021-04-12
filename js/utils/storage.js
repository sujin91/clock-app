export const NAMESPACE = 'clock-app_'

export const Storage = {
    get: key => {
        try { //용량, 권한 체크
            const data = JSON.parse(localStorage.getItem(`${NAMESPACE}${key}`)) || []
            return data
        }
        catch (err) {
            
        }
    },
    set: (key, value) => {
        localStorage.setItem(`${NAMESPACE}${key}`, JSON.stringify(value))
    }
}
