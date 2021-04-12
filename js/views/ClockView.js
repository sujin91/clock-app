import View from './View.js'

// 시계탭
class ClockView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$clock = this.$element.querySelector('.clock')
    }

    // 시계 렌더
    render(clock) {
        const hour = String(clock.hour).padStart(2, "0") 
        const min = String(clock.min).padStart(2, "0")
        const sec = String(clock.sec).padStart(2, "0")

        this.$clock.innerHTML = `${hour}:${min}:${sec}`
    }
}

export default ClockView
