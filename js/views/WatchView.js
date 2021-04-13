import View from './View.js'

import { INIT_TIMESTAMP, BTN_DELETE } from '../constants.js'

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
        this.$recordList.childElementCount === 0 && this.$recordList.addEventListener('click', this.onDeleteRecord)  
        this.emit('@ADD', { time: this.$watch.innerHTML })
    }

    onDeleteRecord = e => {
        e.target.id === 'buttonDelete' && this.emit('@DELETE', { id: Number(e.toElement.parentNode.id) })
        this.$recordList.firstChild === null && this.destroy('click', this.$recordList, this.onDeleteRecord)
    }

    // 스톱워치 시계 렌더
    renderStopWatch(watchTime) {
        this.hour = String(Math.floor(watchTime / 1000 / 60 / 60) % 60).padStart(2, "0")
        this.min = String(Math.floor(watchTime / 1000 / 60) % 60).padStart(2, "0")
        this.sec = String(Math.floor(watchTime / 1000) % 60).padStart(2, "0")
        this.msec = String(Math.floor(watchTime) % 1000).padStart(3, "0")
        
        this.$watch.innerHTML = `${this.hour}:${this.min}:${this.sec}.${this.msec}`
    }

    // 탭이동으로 인한 스톱워치 마지막 기록값 렌더
    renderLastWatch(records) {
        // 기록이 있으면
        if(records.length > 0) {
            let lastRecord = records[records.length - 1]
            this.$watch.innerHTML = `${lastRecord.time.hour}:${lastRecord.time.min}:${lastRecord.time.sec}.${lastRecord.time.msec}`

            return
        } 
        
        this.renderReset()
    }

    // 스톱워치 기록 목록 렌더
    renderList(list) {
        while (this.$recordList.firstChild) {
            this.$recordList.removeChild(this.$recordList.firstChild)
        }

        list.forEach(item => {
            const $li = this.createElement('li')
            $li.id = item.id

            const $span = this.createElement('span')
            $span.innerHTML = `${item.time.hour}:${item.time.min}:${item.time.sec}.${item.time.msec}`

            const $button = this.createElement('button', 'button_delete')
            $button.id = 'buttonDelete'
            $button.innerHTML = BTN_DELETE
            
            $li.append($span, $button)
            this.$recordList.append($li)    
        })

        this.$recordCount.innerHTML = `총: ${list.length}` 
    }
}

export default WatchView
