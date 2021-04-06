import View from './View.js'

// 시계탭
class ClockView extends View {
    constructor($target) {
        super();
        this.$element = $target
        this.$clock = this.$element.querySelector('.clock')
    }

    // 시계 렌더
    render = () => {
        const currentDate = new Date() //현재 시간
    
        const currentTime = {
            hour: currentDate.getHours(),
            min: currentDate.getMinutes(),
            sec: currentDate.getSeconds()
        }
        
        this.$clock.innerHTML = `${currentTime.hour < 10 ? `0${currentTime.hour}` : currentTime.hour}:${currentTime.min < 10 ? `0${currentTime.min}` : currentTime.min}:${currentTime.sec < 10 ? `0${currentTime.sec}` : currentTime.sec}`
    }
}

export default ClockView
