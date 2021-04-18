/**
 * 문자열로 들어온 시,분,초를 초로 계산하여 숫자로 반환
 * @param {String} hour: 시
 * @param {String} min: 분
 * @param {String} sec: 초
 */
export const calcSeconds = function (hour, min, sec) {
    return Number(hour) * 60 * 60 + Number(min) * 60 + Number(sec)
}

/**
 * 시,분,초,(밀리초)를 time 객체로 반환
 * @param {Number} hour: 시
 * @param {Number} min: 분
 * @param {Number} sec: 초
 * @param {Number} msec: (밀리초)
 */
export const getTimeObj = function (hour, min, sec, msec) {
    const timeObj = {
        hour: hour,
        min: min,
        sec: sec,
    }

    if (msec) timeObj.msec = msec
    return timeObj
}

/**
 * time 객체를 padstart 하여 문자열로 반환함
 * @param {Object} obj: time 객체
 */
export const getTimeStrObj = function (obj) {
    for (const unit in obj) {
        obj[unit] = String(obj[unit]).padStart(2, '0')
        if (unit === 'msec') String(obj[unit]).padStart(3, '0')
    }

    return obj
}
export default { calcSeconds, getTimeObj, getTimeStrObj }
