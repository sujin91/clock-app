import { Message, State } from '../constants.js'
import { Storage } from '../utils/Storage.js'
import { MessageView } from '../views/MessageView.js'
import ClockModel from './ClockModel.js'

class AlarmModel extends ClockModel {
    constructor() {
        super()
        this.alarms = Storage.get('alarms')
    }

    // 리스트 가져오기
    list() {
        return this.alarms
    }

    // 추가
    add(time) {
        const [hour, min, sec] = time.split(':')
        const alarm = {
            seconds: this.getSeconds(hour, min, sec),
            time: {
                date: this.getClock().date,
                hour: hour,
                min: min,
                sec: sec,
            },
            state: State.PENDING,
        }

        this.alarms.push(alarm)

        // 시간별 오름차순 정렬 
        this.alarms.sort((a, b) => a.seconds - b.seconds)
        this._commit(this.alarms)
    }

    // '초'에 따른 State 변화
    changeState() {
        const currentTime = this.getClock()
        const currentSeconds = this.getSeconds(currentTime.hour, currentTime.min, currentTime.sec)

        this.alarms.forEach( item => {
            // 알람 state Change
            if(item.seconds - currentSeconds <= 10 && item.seconds - currentSeconds > 0) item.state = State.ACTIVE
            else if(item.seconds - currentSeconds < 0 ) item.state = State.EXPIRED

            // 자정 Change
            if(item.time.date !== currentTime.date) this.alarms = this.alarms.filter( item => item.time.date === currentTime.date)
        })
        this._commit(this.alarms)
    }

    isError(inputTime) {
        const currentTime = this.getClock()
        const currentSeconds = this.getSeconds(currentTime.hour, currentTime.min, currentTime.sec)
        const inputSeconds = this.getSeconds(inputTime.hour, inputTime.min, inputTime.sec)
        
        // 빈자리 있는지 확인
        const isEmpty = inputTime.length < 8
        // 과거 시간인지 확인
        const isPast = inputSeconds - currentSeconds < 0 ? true : false
        // 존재하는 알람인지 확인
        const isExist = this.alarms.some( item => item.seconds === inputSeconds )

        // MessageView
        if(isEmpty) {
            MessageView(document.querySelector('.alarm_area'), 'warning', Message.EMPTY)

            return true
        }
        if(isExist) {
            MessageView(document.querySelector('.alarm_area'), 'warning', Message.EXIST)

            return true
        }
        if(isPast) {
            MessageView(document.querySelector('.alarm_area'), 'warning', Message.PAST)

            return true
        }
         
        return false
    }

    // 리스트 요소 삭제
    delete(seconds) {
        this.alarms = this.alarms.filter( item => item.seconds !== Number(seconds))
        this._commit(this.alarms)
    }

    _commit(alarms) {
        Storage.set('alarms', this.alarms)
    }

    setTimer() {
        this.timer = setInterval(() => {
            // this.setClock()
            this.changeState()
            this.notify('@ALARM', this.alarms)
        }, 1000)
    }

    clearTimer() {
        clearInterval(this.timer)
        return false
    }
}

export default AlarmModel
