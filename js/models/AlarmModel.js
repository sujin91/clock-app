import ClockModel from './ClockModel.js'

import { MESSAGE, STATE, REGEX_CHECK_FORMAT } from '../Constants.js'
import { Storage } from '../utils/Storage.js'
import { fetchData } from '../utils/fetchData.js'

class AlarmModel extends ClockModel {
    constructor() {
        super()
        this.alarms = Storage.get('ALARMS') || []
    }

    // 샘플 데이터 Fetch
    getFetchData = async (path) => {
        this.alarms = await fetchData(path)
        
        // 샘플 데이터에 오늘 날짜 설정
        this.alarms.map( item => {
            item.date = this.getClock().date
        })

        // fetch 못하면 데이터 없는 상태로 시작
        this.setState(this.alarms || [])
    }

    // 리스트 가져오기
    getList() {
        return this.alarms
    }

    // 추가
    add(time) {
        const [hour, min, sec] = time.split(':')
        // util로 빼보자
        const alarm = {
            seconds: this.getSeconds(hour, min, sec),
            date: this.getClock().date,
            time: {
                hour: hour,
                min: min,
                sec: sec,
            },
            //time,  이렇게 덩어리로 넣을수있게 
            state: STATE.PENDING,
        }

        this.alarms.push(alarm)

        // 시간별 오름차순 정렬 
        this.alarms.sort((a, b) => a.seconds - b.seconds)
        this._commit(this.alarms)
    }

    // '초'에 따른 State 변화
    setState() {
        const currentTime = this.getClock()
        const currentSeconds = this.getSeconds(currentTime.hour, currentTime.min, currentTime.sec)
        //map되나보기

        this.alarms.forEach( item => {
            // 알람 state Change
            if (item.seconds - currentSeconds <= 10 && item.seconds - currentSeconds > 0) item.state = STATE.ACTIVE
            else if (item.seconds - currentSeconds < 0 ) item.state = STATE.EXPIRED
            // 자정 Change
            if (item.date < currentTime.date) this.alarms = this.alarms.filter( item => item.date === currentTime.date)
        })
        this._commit(this.alarms)
    }

    isError(inputTime) {
        const [hour, min, sec] = inputTime.split(':')
        const currentTime = this.getClock()
        const inputSeconds = this.getSeconds(hour, min, sec)
        const currentSeconds = this.getSeconds(currentTime.hour, currentTime.min, currentTime.sec)

        // 시간형식에 맞는지 확인
        if (!REGEX_CHECK_FORMAT.test(inputTime)) return MESSAGE.EMPTY
        // 과거 시간인지 확인
        if (inputSeconds - currentSeconds <= 0) return MESSAGE.PAST
        // 존재하는 알람인지 확인
        if (this.alarms.some(item => item.seconds === inputSeconds)) return MESSAGE.EXIST

        return false
    }

    // 리스트 요소 삭제
    delete(seconds) {
        this.alarms = this.alarms.filter( item => item.seconds !== Number(seconds))
        this._commit(this.alarms)
    }

    _commit(alarms) {
        Storage.set('ALARMS', alarms)
    }

    setTimer() {
        this.timer = setInterval(() => {
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
