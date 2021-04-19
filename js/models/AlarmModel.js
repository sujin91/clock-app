import ClockModel from './ClockModel.js'

import { MESSAGE, STATE } from '../Constants.js'
import { storage } from '../utils/storage.js'
import { fetchData } from '../utils/fetchData.js'
import { refineData } from '../utils/refineData.js'
import { calcSeconds, getTimeObj } from '../utils/time.js'

class AlarmModel extends ClockModel {
    constructor() {
        super()
        this.alarms = new Map()
    }

    // 샘플 데이터 비동기 fetch
    fetchSample = async (path) => {
        const result = await fetchData(path)
        // fetch 성공시 데이터 정제, 실패시 데이터 없는 상태로 시작
        this.alarms = result ? refineData(result) : []

        this.setState()
    }

    // 리스트 가져오기
    getList() {
        return this.alarms
    }

    // 추가
    add(time) {
        const [hour, min, sec] = time.split(':')
        const seconds = calcSeconds(hour, min, sec)
        const alarm = {
            date: this.getClockObj().date,
            time: getTimeObj(hour, min, sec),
            state: STATE.PENDING,
        }

        this.alarms.set(seconds, alarm)
        // 키 값 오름차순 정렬
        this.alarms = new Map(
            [...this.alarms.entries()].sort((a, b) => a[0] - b[0])
        )
        this._commit(this.alarms)
    }

    // '초'에 따른 State 변화
    setState() {
        const {
            time: { hour, min, sec },
            date,
        } = this.getClockObj()
        const currentSeconds = calcSeconds(hour, min, sec)

        for (let [seconds, value] of this.alarms.entries()) {
            const diffTime = seconds - currentSeconds

            // 알람 state change
            if (diffTime <= 10 && diffTime >= 0) value.state = STATE.ACTIVE
            else if (diffTime < 0) value.state = STATE.EXPIRED
            else value.state = STATE.PENDING

            // 자정 change
            if (value.date < date) this.alarms.clear()
        }
        this._commit(this.alarms)
    }

    // 알람 등록시 에러 체크
    isError(inputTime) {
        const [hour, min, sec] = inputTime.split(':')
        const inputSeconds = calcSeconds(hour, min, sec) // input 받은시간
        const { time } = this.getClockObj()
        const currentSeconds = calcSeconds(time.hour, time.min, time.sec) // 현재시간

        // 시간형식에 맞는지 확인(hh:mm:ss 정규식)
        if (!/^[0-9]{2,2}:[0-9]{2,2}:[0-9]{2,2}$/g.test(inputTime))
            return MESSAGE.EMPTY
        // 과거 시간인지 확인
        if (inputSeconds - currentSeconds <= 0) return MESSAGE.PAST
        // 존재하는 알람인지 확인
        if (this.alarms.has(inputSeconds)) return MESSAGE.EXIST

        return false
    }

    // 리스트 요소 삭제
    delete(id) {
        this.alarms.delete(id)
        this._commit(this.alarms)
    }

    // storage 저장
    _commit(alarms) {
        storage.set('ALARMS', alarms)
    }

    setTimer() {
        this.timer = setInterval(() => {
            // 1초마다 state 변경하고 event broadcast
            this.setState()
            this.emit('@TIMER', this.alarms)
        }, 1000)
        return true //타이머가 실행되었다고 Flag(true)로 전달함
    }

    clearTimer() {
        clearInterval(this.timer)
        return false //타이머가 삭제되었다고 Flag(false)로 전달함
    }
}

export default AlarmModel
