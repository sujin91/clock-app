import View from './View.js'
import { INIT_TIMESTAMP, BTN_DELETE } from '../Constants.js'

class WatchView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$watch = this.$element.querySelector('#watch')
        this.$buttonReset = this.$element.querySelector('#buttonReset')
        this.$buttonRecord = this.$element.querySelector('#buttonRecord')
        this.$recordCount = this.createElement('strong', 'count')
        this.$recordList = this.createElement('ul', 'list')
        this.$element.append(this.$recordList, this.$recordCount)
        this.$watch.style.setProperty('display', 'none')

        this.bindEvents()
    }

    // 00:00:00 초기화 렌더
    renderReset() {
        this.$watch.style.setProperty('display', 'block')
        this.$watch.innerHTML = INIT_TIMESTAMP
    }

    bindEvents() {
        this.$buttonRecord.addEventListener('click', this.onAddRecord)
        this.$buttonReset.addEventListener('click', this.onReset)
        this.$recordList.addEventListener('click', this.onDeleteRecord)
    }

    onReset = () => this.emit('@RESET') // broadcast the event '@RESET'

    onAddRecord = () => {
        //리스트가 생성되면 다시 이벤트 바인딩
        if (this.$recordList.childNodes.length === 0)
            this.$recordList.addEventListener('click', this.onDeleteRecord)
        this.emit('@ADD', { time: this.$watch.innerHTML })
    }

    onDeleteRecord = (e) => {
        //리스트가 없어 삭제버튼 클릭이벤트 언바인딩
        if (this.$recordList.childNodes.length === 0)
            this.off('click', this.$recordList, this.onDeleteRecord)
        this.emit('@DELETE', { id: Number(e.toElement.parentNode.id) })
    }

    // 스톱워치 시계 렌더
    renderStopWatch(watchTime) {
        // 뺄수있나봅시다ㅏ
        this.hour = String(
            Math.floor(watchTime / 1000 / 60 / 60) % 60
        ).padStart(2, '0')
        this.min = String(Math.floor(watchTime / 1000 / 60) % 60).padStart(
            2,
            '0'
        )
        this.sec = String(Math.floor(watchTime / 1000) % 60).padStart(2, '0')
        this.msec = String(Math.floor(watchTime) % 1000).padStart(3, '0')

        this.$watch.innerHTML = `${this.hour}:${this.min}:${this.sec}.${this.msec}`
    }

    // 스톱워치 기록 목록 렌더
    renderList(list) {
        this.clearChildElement(this.$recordList)

        for (let [key, value] of list.entries()) {
            const $li = this.createElement('li')
            $li.id = key

            const $span = this.createElement('span')
            $span.innerHTML = `${value.time.hour}:${value.time.min}:${value.time.sec}.${value.time.msec}`

            const $button = this.createElement('button', 'button_delete')
            $button.id = 'buttonDelete'
            $button.innerHTML = BTN_DELETE

            $li.append($span, $button)
            this.$recordList.append($li)
        }

        this.$recordCount.innerHTML = `총: ${list.size}`
    }
}

export default WatchView
