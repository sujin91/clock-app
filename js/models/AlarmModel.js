import {storage} from '../utils/storage.js'

class AlarmModel {
    constructor() {
        this.alarms = storage.get('alarms')
    }

    // 리스트 가져오기
    list = () => this.alarms

    // 추가
    add = time => {
        const inputTimeStr = time.split(':')
        const alarm = {
            seconds: Number(inputTimeStr[0]) * 60 * 60 + Number(inputTimeStr[1]) * 60 + Number(inputTimeStr[2]),  
            time: {
                date: this.getCurrentTime().date,
                hour: inputTimeStr[0],
                min: inputTimeStr[1],
                sec: inputTimeStr[2],
            },
            state: 'pending',
        }

        this.alarms.push(alarm)

        // 시간별 오름차순 정렬 
        this.alarms.sort((a, b) => a.seconds - b.seconds)
        this._commit(this.alarms)
    }

    // 현재 시간 가져오기
    getCurrentTime = () => {
        const currentDate = new Date() 
        const currentTime = {
            date: currentDate.getDate(),
            hour: currentDate.getHours(),
            min: currentDate.getMinutes(),
            sec: currentDate.getSeconds()
        }
    
        return currentTime
    }

    // '초'에 따른 State 변화
    changeState = () => {
        const currentTime = this.getCurrentTime()
        const currentSeconds = currentTime.hour * 60 * 60 + currentTime.min * 60 + currentTime.sec

        this.alarms.forEach( item => {
            // 알람 state Change
            if(item.seconds - currentSeconds <= 10 && item.seconds - currentSeconds > 0) item.state = 'active'
            else if(item.seconds - currentSeconds < 0 ) item.state = 'expired'

            // 자정 Change
            if(item.time.date !== currentTime.date) this.alarms = this.alarms.filter( item => item.time.date === currentTime.date)
        })
        this._commit(this.alarms)
    }

    // 리스트 요소 삭제
    delete = seconds => {
        this.alarms = this.alarms.filter( item => item.seconds !== Number(seconds))
        this._commit(this.alarms)
    }

    _commit = alarms => {
        storage.set('alarms', this.alarms)
    }
}

export default AlarmModel