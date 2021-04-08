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
            hour: String(currentDate.getHours()).padStart(2, "0"),
            min: String(currentDate.getMinutes()).padStart(2, "0"),
            sec: String(currentDate.getSeconds()).padStart(2, "0")
        }
        
        this.$clock.innerHTML = `${currentTime.hour}:${currentTime.min}:${currentTime.sec}`
    }
}

export default ClockView
