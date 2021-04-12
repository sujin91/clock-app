import { INIT_TIMESTAMP, BTN_DELETE, BTN_RESET, BTN_RECORD } from '../constants.js'

import View from './View.js'

class WatchView extends View {
    constructor($target) {
        super()
        this.$element = $target
        this.$watch = this.$element.querySelector('.watch')
        this.$buttonGroup = this.$element.querySelector('.button_area')
        // this.$buttonReset = this.$element.querySelector('.button_reset')
        // this.$buttonRecord = this.$element.querySelector('.button_record')
        this.$recordCount = this.createElement('strong', 'count')
        this.$recordList = this.createElement('ul', 'list')
        this.$element.append(this.$recordList, this.$recordCount)
        this.$watch.style.setProperty('display', 'none')
        // this.bindEvents()
        this.bindBtnEvent()
        this.bindDeleteEvent()
    }

    // 00:00:00 초기화 렌더
    renderReset() {
        this.$watch.style.setProperty('display', 'block')
        this.$watch.innerHTML = INIT_TIMESTAMP
    }

    bindBtnEvent () {
        this.$buttonGroup.addEventListener('click', e => {
            e.target.innerHTML === BTN_RESET && this.onReset()
            e.target.innerHTML === BTN_RECORD && this.onAddRecord()
        })
    }

    bindDeleteEvent () {
        //삭제버튼
        this.$recordList.addEventListener('click', e => e.target.className === 'button_delete' && this.onDeleteRecord(e))
    }

    //초기화
    onReset() {
        this.emit('@reset') // broadcast the event '@reset'
    }

    //기록
    onAddRecord() {
        this.emit('@click', { time: this.$watch.innerHTML })
    }

    //삭제
    onDeleteRecord(e) {
        this.emit('@delete', { id: Number(e.toElement.parentNode.id) }) 

        // 언바인딩
        this.$recordList.removeEventListener('click', e => this.onDeleteRecord(e))
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
        } 
        else {
            // 00:00:00 렌더
            this.renderReset()
        }
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
            $button.innerHTML = BTN_DELETE
            
            $li.append($span, $button)
            this.$recordList.append($li)    
        })

        this.$recordCount.innerHTML = `총: ${list.length}` 
    }
}

export default WatchView
