import { Message } from '../constants.js'
import { MessageView } from './MessageView.js'

import View from './View.js'

// 알람 탭
class AlarmView extends View {
    constructor($target) {
        super();        
        this.$element = $target
        this.$form = this.$element.querySelector('.form_section')
        this.$inputEl = this.$form.querySelector('.input')
        this.$buttonGetTime = this.$form.querySelector('.button_getTime')
        this.$buttonAddAlarm = this.$form.querySelector('.button_addAlarm')
        this.$alarmCount = this.createElement('strong', 'count')
        this.$alarmList = this.createElement('ul', 'list')

        
        this.$element.append(this.$alarmList, this.$alarmCount)

        this.bindEvents()
    }

    // 알람폼에 있는 시간
    getInputTime() {
        const TimeStr = this.$inputEl.value.split(':')
        const inputTime = {
            length: this.$inputEl.value.length,
            hour: TimeStr[0],
            min: TimeStr[1],
            sec: TimeStr[2]
        }

        return inputTime
    }

    bindEvents() {
        // 현재시간버튼
        this.$buttonGetTime.addEventListener('click', e => this.onClickGetTime())

        // 키보드처리, 콜론자동완성
        this.$inputEl.addEventListener('keyup', e => this.onKeyUp(e))
        this.$inputEl.addEventListener('keydown', e => this.onKeyDown(e))

        // 등록버튼
        this.$form.addEventListener('submit', e => {
            e.preventDefault()
            this.onClickAddAlarm(this.$inputEl)
        })

        // 삭제버튼
        this.$alarmList.addEventListener('click', e => e.target.className === 'button_delete' && this.onClickDeleteAlarm(e) )
    }

    onKeyUp(e) {
        const inputTime = this.getInputTime()

        if(inputTime.hour > 23 || inputTime.min > 59 || inputTime.sec > 59) {
            MessageView(document.querySelector('.alarm_area'), 'warning', Message.FORMAT)
            this.$inputEl.value = this.$inputEl.value.substr(0, this.$inputEl.value.length - 1);
        }

        e.key === 'Enter' && this.emit('@submit', {input: this.$inputEl.value})
    }

    // 숫자, 주요키만 사용 가능
    filterNumber(e) {
        if (Number(e.key) >= 0 && Number(e.key) < 10) {
            this.isDeleteMode = false
            return
        }
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return 
        }
        if (e.key === 'Tab' || e.key === 'Home' || e.key === 'End' || e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' || e.key === 'Delete') {
            return
        }
        if ( e.key === 'Backspace' ) {
            this.isDeleteMode = true
            return
        }
        
        e.preventDefault();
    }
    
    onKeyDown(e) {
        // 숫자&&명령어만 사용 가능
        this.filterNumber(e)
        
        // 자동 콜론 생성
        if( (!this.isDeleteMode && (this.$inputEl.value.length === 2 || this.$inputEl.value.length === 5))) {
            this.$inputEl.value = `${this.$inputEl.value}:`
        }

        // 콜론지울 때 처리
        if(e.key === 'Backspace' && (this.$inputEl.value.length === 4 || this.$inputEl.value.length === 7) ) {
            this.$inputEl.value = this.$inputEl.value.substr(0, this.$inputEl.value.length - 1);    
        }
    }

    // 현재시간
    onClickGetTime() {
        this.$inputEl.focus();
        this.emit('@click')
    }

    // 등록
    onClickAddAlarm() {
        this.$inputEl.focus();
        this.emit('@submit', {input: this.$inputEl.value})
    }

    // 삭제
    onClickDeleteAlarm(e) {
        this.emit('@delete', {id: e.toElement.parentNode.id})
    }

    // 폼요소에 현재시각 렌더
    renderTime(currentTime) {
        //문자열이 2자리수, 그렇지 않으면 앞에 0 삽입
        const hour = String(currentTime.hour).padStart(2, "0") 
        const min = String(currentTime.min).padStart(2, "0")
        const sec = String(currentTime.sec).padStart(2, "0")

        this.$inputEl.value = `${hour}:${min}:${sec}`
    }

    // 알람목록 렌더
    renderList(list) {
        while (this.$alarmList.firstChild) {
            this.$alarmList.removeChild(this.$alarmList.firstChild)
        }

        list.forEach(item => {
            const $li = this.createElement('li')
            $li.id = item.seconds

            const $span = this.createElement('span')
            $span.innerHTML = `${item.time.hour}:${item.time.min}:${item.time.sec}`

            if(item.state === 'expired') $span.style.color = '#888'
            else if(item.state === 'active') $span.style.color = '#f00'
            else $span.style.color = '#000'

            const $button = this.createElement('button', 'button_delete')
            $button.innerHTML = '삭제'
            
            $li.append($span, $button)
            this.$alarmList.append($li)    
        })

        this.$alarmCount.innerHTML = `총: ${list.length}` 
    }
}

export default AlarmView
