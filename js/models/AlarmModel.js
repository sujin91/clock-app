import {storage} from '../utils/storage.js'
import { MessageView } from '../views/MessageView.js'

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

    isError = (inputTime) => {
        // 초로 변환
        const currentTime = this.getCurrentTime()
        const currentSeconds = currentTime.hour * 60 * 60 + currentTime.min * 60 + currentTime.sec
        const inputSeconds = Number(inputTime.hour) * 60 * 60 + Number(inputTime.min) * 60 + Number(inputTime.sec)
        
         // 빈자리 있는지 확인
         const isEmpty = inputTime.length < 8 ? true : false;

         // 과거 시간인지 확인
         const isPast = inputSeconds - currentSeconds < 0 ? true : false;
 
         // 존재하는 알람인지 확인
         const isExist = this.alarms.some( item => item.seconds === inputSeconds )
 
         // MessageView
         if(isEmpty) {
             MessageView(this.$buttonAddAlarm, 'warning', '시간 형식에 맞게 입력해주세요.')
         }
         else if(isExist) {
             MessageView(this.$buttonAddAlarm, 'warning', '이미 존재하는 알람입니다.')
         }
         else {
             isPast && MessageView(this.$buttonAddAlarm, 'warning', '과거시간은 알람을 등록할 수 없습니다.')
         }
         
         // 둘중 하나라도 유효하지 않으면 isError는 TRUE
         return isExist || isPast || isEmpty
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