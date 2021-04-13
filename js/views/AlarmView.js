import { BTN_DELETE, Color, State } from '../constants.js'
import { Message } from '../constants.js'
import { MessageView } from './MessageView.js'

import View from './View.js'

// 알람 탭
class AlarmView extends View {
    constructor($target) {
        super()        
        this.$element = $target
        this.$form = this.$element.querySelector('#formSection')
        this.$input = this.$form.querySelector('#inputAlarm')
        this.$buttonGetTime = this.$form.querySelector('#buttonGetTime')
        this.$buttonAddAlarm = this.$form.querySelector('#buttonAddAlarm')
        this.$alarmCount = this.createElement('strong', 'count')
        this.$alarmList = this.createElement('ul', 'list')

        this.$element.append(this.$alarmList, this.$alarmCount)

        this.bindEvents()
        this.bindDeleteEvent()
    }

    bindEvents() {
        // 현재시간버튼
        this.$buttonGetTime.addEventListener('click', e => this.onClickGetTime())

        // 키보드처리, 콜론자동완성
        this.$input.addEventListener('keydown', e => this.onKeyDown(e))

        this.$input.addEventListener('input', e => this.onInput(e))

        // 등록버튼
        this.$form.addEventListener('submit', e => {
            e.preventDefault()
            this.onClickAddAlarm(this.$input)
        })
    }

    bindDeleteEvent () {
        //삭제버튼
        this.$alarmList.addEventListener('click', e => e.target.id === 'buttonDelete' && this.onDeleteAlarm(e))
    }

    onInput(e) {
        this.regex = /[^0-9:]/gi //숫자 + 콜론 정규식
        this.$input.value = this.$input.value.replace(this.regex, '')

        if( (!this.backSpaceMode && (this.$input.value.length === 2 || this.$input.value.length === 5))) {
            this.$input.value = `${this.$input.value}:`
        }

        this.inputAlarm = this.$input.value.split(':')//.map(Number)

        console.log(this.inputAlarm)


        if (Number(this.inputAlarm[0]) > 23) {
            MessageView(document.querySelector('#alarm_area'), 'warning', Message.HOUR_FORMAT)
            this.inputAlarm.splice(0);
            this.$input.value = this.inputAlarm.join(':')
        }
        if (Number(this.inputAlarm[1]) > 59) {
            MessageView(document.querySelector('#alarm_area'), 'warning', Message.MIN_FORMAT)
            this.inputAlarm.splice(1);
            this.$input.value = this.inputAlarm.join(':')+':'
        }
        if (Number(this.inputAlarm[2]) > 59) {
            MessageView(document.querySelector('#alarm_area'), 'warning', Message.SEC_FORMAT)
            this.inputAlarm.splice(2);
            this.$input.value = this.inputAlarm.join(':')+':'
        } 
    }
    
    onKeyDown(e) {
        // 숫자&&주요키만 사용 가능
        const whiteList = ['Control', 'Alt', 'Meta', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab', 'Home', 'End', 'Delete']

        if (Number(e.key) >= 0 && Number(e.key) < 10) {
            this.backSpaceMode = false
            return
        }
        if (whiteList.some(code => e.code === code)) {
            this.backSpaceMode = false
            return
        }
        if ( e.key === 'Backspace' ) {
            this.backSpaceMode = true
            return
        }
        
        e.preventDefault()
    }

    // 현재시간
    onClickGetTime() {
        this.$input.focus()
        this.emit('@CLICK')
    }

    // 등록
    onClickAddAlarm() {
        this.$input.focus()
        this.emit('@SUBMIT', {input: this.$input.value})
    }

    // 삭제
    onDeleteAlarm(e) {
        this.emit('@DELETE', {id: e.toElement.parentNode.id})

        // 언바인딩
        this.$alarmList.removeEventListener('click', e => this.onDeleteAlarm(e))
    }

    // 폼요소에 현재시각 렌더
    renderTime(currentTime) {
        //문자열이 2자리수, 그렇지 않으면 앞에 0 삽입
        const hour = String(currentTime.hour).padStart(2, "0") 
        const min = String(currentTime.min).padStart(2, "0")
        const sec = String(currentTime.sec).padStart(2, "0")

        this.$input.value = `${hour}:${min}:${sec}`
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

            item.state === State.PENDING && $span.style.setProperty('color', Color.BLACK)
            item.state === State.EXPIRED && $span.style.setProperty('color', Color.GRAY)
            item.state === State.ACTIVE && $span.style.setProperty('color', Color.RED)
            
            const $button = this.createElement('button', 'button_delete')
            $button.id = 'buttonDelete'
            $button.innerHTML = BTN_DELETE
            
            $li.append($span, $button)
            this.$alarmList.append($li)    
        })

        this.$alarmCount.innerHTML = `총: ${list.length}` 
    }
}

export default AlarmView
