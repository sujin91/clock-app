import View from './View.js'
import { getTimeStrObj } from '../utils/time.js'

class ClockView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$clock = this.$element.querySelector('#clock')
    }

    // 시계 렌더
    render(currentTime) {
        const { time } = currentTime
        const { hour, min, sec } = getTimeStrObj(time)

        this.$clock.innerHTML = `${hour}:${min}:${sec}`
    }
}

export default ClockView
