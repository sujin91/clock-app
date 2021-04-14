import View from './View.js'
import MessageView from '../views/MessageView.js'

import { MESSAGE, BTN_DELETE, COLOR, STATE } from '../Constants.js'

// 알람 탭
class AlarmView extends View {
    constructor($target) {
        super()        
        this.$element = $target
        this.$form = this.$element.querySelector('#formSection')
        this.$input = this.$form.querySelector('#inputAlarm')
        this.$buttonGetTime = this.$form.querySelector('#buttonGetTime')
        this.$alarmCount = this.createElement('strong', 'count')
        this.$alarmList = this.createElement('ul', 'list')
        this.$element.append(this.$alarmList, this.$alarmCount)

        this.message = new MessageView()
        this.bindEvents()
    }

    bindEvents() {
        // input, 키보드처리
        this.$input.addEventListener('keydown', this.onKeyDown)
        this.$input.addEventListener('input', this.onInput)
        // 현재시간버튼
        this.$buttonGetTime.addEventListener('click', this.onClickGetTime)
        // 등록버튼
        this.$form.addEventListener('submit', this.onSubmitAlarm)
        // 삭제버튼
        this.$alarmList.addEventListener('click', this.onDeleteAlarm)
    }

    onInput = e => {
        this.regex = /[^0-9:]/gi // 숫자 + 콜론 정규식
        this.$input.value = this.$input.value.replace(this.regex, '')

        // 콜론 생성
        if ( (!this.backSpaceMode && (this.$input.value.length === 2 || this.$input.value.length === 5))) {
            this.$input.value = `${this.$input.value}:`
        }

        this.inputAlarm = this.$input.value.split(':')
        this.message.$element?.remove()

        if (Number(this.inputAlarm[0]) > 23) {    
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.HOUR_FORMAT)
            this.inputAlarm.splice(0);
            this.$input.value = this.inputAlarm.join(':')
        }
        if (Number(this.inputAlarm[1]) > 59) {
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.MIN_FORMAT)
            this.inputAlarm.splice(1);
            this.$input.value = this.inputAlarm.join(':')+':'
        }
        if (Number(this.inputAlarm[2]) > 59) {
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.SEC_FORMAT)
            this.inputAlarm.splice(2);
            this.$input.value = this.inputAlarm.join(':')+':'
        } 
    }
    
    onKeyDown = e => {
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

    onClickGetTime = () => {
        this.$input.focus()
        this.emit('@CLICK')
    }

    onSubmitAlarm = e => {
        e.preventDefault()
        this.$alarmList.childElementCount === 0 && this.$alarmList.addEventListener('click', this.onDeleteAlarm) 
        this.$input.focus()
        this.emit('@ADD', {input: this.$input.value})
    }

    onDeleteAlarm = e => {
        e.target.id === 'buttonDelete' && this.emit('@DELETE', {id: e.toElement.parentNode.id})
        this.$alarmList.firstChild === null && this.destroy('click', this.$alarmList, this.onDeleteAlarm)
    }

    // 폼요소에 현재시각 렌더
    renderTime(currentTime) {
        // 문자열이 2자리수, 그렇지 않으면 앞에 0 삽입
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

            item.state === STATE.PENDING && $span.style.setProperty('color', COLOR.BLACK)
            item.state === STATE.EXPIRED && $span.style.setProperty('color', COLOR.GRAY)
            item.state === STATE.ACTIVE && $span.style.setProperty('color', COLOR.RED)
            
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
