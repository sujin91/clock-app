class Timer {
    constructor () {
        this.time = {}
        this.timer = setInterval(() => {
            this.time.hour = Math.floor(Date.now() / 1000 / 60 / 24) % 60
            this.time.min = Math.floor(Date.now() / 1000 / 60) % 60
            this.time.sec = Math.floor(Date.now() / 1000) % 60
            
            console.log(this.time)
        }, 1000)
    }
}
export default Timer