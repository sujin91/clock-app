import EventEmitter from '../utils/EventEmitter.js'

class ClockModel extends EventEmitter {
    constructor() {
        super()
        this.clock = {}
        this.setClock()
    }

    setClock() {
        const dataObj = new Date()
        this.clock = {
            date: dataObj.getDate(),
            hour: dataObj.getHours(),
            min: dataObj.getMinutes(),
            sec: dataObj.getSeconds(),
        }
    }

    getClock() {
        return this.clock
    }

    getSeconds(hour, min, sec) {
        return Number(hour) * 60 * 60 + Number(min) * 60 + Number(sec)
    }

    setTimer() {
        this.timer = setInterval(() => {
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
