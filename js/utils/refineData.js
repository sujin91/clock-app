import { calcSeconds } from './time.js'

export const refineData = (data) => {
    const today = new Date()
    const refineMap = new Map(data)
    let refineData = new Map()

    // new Map(data)
    for (let value of refineMap.values()) {
        const { hour, min, sec } = value.time

        // seconds: 재계산하여 refine
        const refineSeconds = calcSeconds(hour, min, sec)

        // date: 현재 날짜로 refine
        value.date = today.getDate()

        // time: padStart하여 refine
        for (const unit in value.time) {
            value.time[unit] = String(value.time[unit]).padStart(2, '0')
        }

        refineData.set(refineSeconds, value)
    }
    // 키 값 오름차순 정렬
    refineData = new Map([...refineData.entries()].sort((a, b) => a[0] - b[0])) 

    return refineData
}
