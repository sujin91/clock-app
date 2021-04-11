class ClockModel {
    constructor() {
        this.clock = {}
    }

    getClock() {
        this.clock = {
            date: new Date().getDate(),
            hour: new Date().getHours(),
            // hour: Math.floor(Date.now() / 1000 / 60 / 24) % 60,
            min: Math.floor(Date.now() / 1000 / 60) % 60,
            sec: Math.floor(Date.now() / 1000) % 60
        }
        return this.clock
    }
}
export default ClockModel