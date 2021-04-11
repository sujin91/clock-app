import Observable from '../utils/Observable.js'

class ClockModel extends Observable {
    constructor() {
        super()
        this.clock = {}
    }

    setClock() {
        this.clock = {
            date: new Date().getDate(),
            hour: new Date().getHours(),
            // hour: Math.floor(Date.now() / 1000 / 60 / 24) % 60,
            min: Math.floor(Date.now() / 1000 / 60) % 60,
            sec: Math.floor(Date.now() / 1000) % 60
        }
    }

    getClock() {
        this.setClock()
        return this.clock
    }

    setTimer() {
        this.timer = setInterval(() => {
            this.setClock()
            this.notify('@CLOCK', this.clock)
        }, 1000)

        return true;
    }

    clearTimer() {
        clearInterval(this.timer)
        return false;
    }
}
export default ClockModel