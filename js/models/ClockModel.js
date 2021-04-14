import EventEmitter from '../utils/EventEmmiter.js'

class ClockModel extends EventEmitter {
    constructor() {
        super()
        this.clock = {}
    }

    setClock() {
        const dataObj = new Date()
        this.clock = {
            date: dataObj.getDate(),
            hour: dataObj.getHours(),
            min: Math.floor(Date.now() / 1000 / 60) % 60,
            sec: Math.floor(Date.now() / 1000) % 60
        }
    }

    getClock() {
        this.setClock()
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
    }

    clearTimer() {
        clearInterval(this.timer)
        return false //타이머가 삭제되었다고 Flag로 전달함
    }
}

export default ClockModel
