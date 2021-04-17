import View from './View.js'

class ClockView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$clock = this.$element.querySelector('#clock')
    }

    // 시계 렌더
    render(currentTime) {
        const { time } = currentTime
        for (const unit in time) {
            time[unit] = String(time[unit]).padStart(2, '0')
        }

        this.$clock.innerHTML = `${time.hour}:${time.min}:${time.sec}`
    }
}

export default ClockView
