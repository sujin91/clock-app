import { calcSeconds } from './time.js'

/**
 * fetch 받은 데이터 정제
 * @param {promise} _data : fetch 받은 데이터
 */
export const refineData = (_data) => {
    const today = new Date()
    const data = new Map(_data) // _data(array)를 data(map)으로
    let refineMap = new Map() // 최종 정제된 데이터

    // refindMap 정제
    for (let value of data.values()) {
        // seconds(key): 재계산하여 refine
        const { hour, min, sec } = value.time
        const refineSeconds = calcSeconds(hour, min, sec)

        // date: 현재 날짜로 refine
        value.date = today.getDate()

        // time: 시,분,초 padStart하여 refine
        for (const unit in value.time) {
            value.time[unit] = String(value.time[unit]).padStart(2, '0')
        }

        refineMap.set(refineSeconds, value)
    }
    // 키 값 오름차순 정렬
    refineMap = new Map([...refineMap.entries()].sort((a, b) => a[0] - b[0]))

    return refineMap
}
