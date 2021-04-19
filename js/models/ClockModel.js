import Observable from '../utils/Observable.js'

class ClockModel extends Observable {
    constructor() {
        super()
        this.clock = {}
    }

    // clock 객체 설정
    setClock() {
        const date = new Date()
        this.clock = {
            date: date.getDate(),
            time: {
                hour: date.getHours(),
                min: date.getMinutes(),
                sec: date.getSeconds(),
            },
        }
    }

    // clock 객체 가져오기
    getClockObj() {
        this.setClock()
        return this.clock
    }

    setTimer() {
        this.timer = setInterval(() => {
            // 1초마다 clock 변경하고 event broadcast
            this.setClock()
            this.emit('@TIMER', this.clock)
        }, 1000)
        return true //타이머가 실행되었다고 Flag(true)로 전달함
    }

    clearTimer() {
        clearInterval(this.timer)
        return false //타이머가 삭제되었다고 Flag(false)로 전달함
    }
}

export default ClockModel
