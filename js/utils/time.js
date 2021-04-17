export const calcSeconds = function (hour, min, sec) {
    return Number(hour) * 60 * 60 + Number(min) * 60 + Number(sec)
}

export const getTimeObj = function (hour, min, sec, msec) {
    const timeObj = {
        hour: hour,
        min: min,
        sec: sec,
    }

    if (msec) timeObj.msec = msec
    return timeObj
}

export default { calcSeconds, getTimeObj }
