import View from './View.js'

class WatchView extends View {
    constructor($target) {
        super();
        this.$element = $target
        this.$clock = document.querySelector('.clock')
        this.$buttonReset = this.$element.querySelector('.button_reset')
        this.$buttonRecord = this.$element.querySelector('.button_record')
        this.$recordCount = this.createElement('strong', 'count')
        this.$recordList = this.createElement('ul', 'list')
        this.$element.append(this.$recordList, this.$recordCount)
        this.$element.style.display = 'none'

        this.bindEvents()
    }

    // 00:00:00 초기화 렌더
    renderReset = () => this.$clock.innerHTML = `00:00:00`

    bindEvents = () => {
        //초기화버튼
        this.$buttonReset.addEventListener('click', e => this.onReset())

        //기록버튼
        this.$buttonRecord.addEventListener('click', e => this.onAddRecord())

        //삭제버튼
        this.$recordList.addEventListener('click', e => e.target.className === 'button_delete' && this.onDeleteRecord(e))
    }

    //초기화
    onReset = () => {
        this.emit('@reset') // broadcast the event '@reset'
    }

    //기록
    onAddRecord = () => {
        this.emit('@click', {time: this.$clock.innerHTML})
    }

    //삭제
    onDeleteRecord = e => this.emit('@delete', {id: Number(e.toElement.parentNode.id)}) 

    // 스톱워치 시계 렌더
    renderStopWatch = ( watchTime ) => {
        this.hour = Math.floor(watchTime / 1000 / 60 / 60) % 60 < 10 ? `0${Math.floor(watchTime / 1000 / 60 / 60) % 60}` : Math.floor(watchTime / 1000 / 60 / 60) % 60
        this.min = Math.floor(watchTime / 1000 / 60) % 60 < 10 ? `0${Math.floor(watchTime / 1000 / 60 ) % 60}` : Math.floor(watchTime / 60000) % 60
        this.sec = Math.floor(watchTime / 1000) % 60 < 10 ? `0${Math.floor(watchTime / 1000) % 60}` : Math.floor(watchTime / 1000) % 60
        this.msec = Math.floor(watchTime) % 1000 
        
        this.$clock.innerHTML = `${this.hour}:${this.min}:${this.sec}.${this.msec}`
    }

    // 탭이동으로 인한 스톱워치 마지막 기록값 렌더
    renderLastWatch = ( records ) => {
        // 기록이 있으면
        if(records.length > 0) {
            let lastRecord = records[records.length - 1]
            this.$clock.innerHTML = `${lastRecord.time.hour}:${lastRecord.time.min}:${lastRecord.time.sec}.${lastRecord.time.msec}`
        } 
    }

    // 스톱워치 기록 목록 렌더
    renderList = list => {
        while (this.$recordList.firstChild) {
            this.$recordList.removeChild(this.$recordList.firstChild)
        }

        list.forEach(item => {
            const $li = this.createElement('li')
            $li.id = item.id

            const $span = this.createElement('span')
            $span.innerHTML = `${item.time.hour}:${item.time.min}:${item.time.sec}.${item.time.msec}`

            const $button = this.createElement('button', 'button_delete')
            $button.innerHTML = '삭제'
            
            $li.append($span, $button)
            this.$recordList.append($li)    
        })

        this.$recordCount.innerHTML = `총: ${list.length}` 

    }
}
export default WatchView