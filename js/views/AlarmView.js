import View from './View.js'
import MessageView from '../views/MessageView.js'

import { WHITELIST, MESSAGE, BTN_DELETE, COLOR, STATE, REGEX_CHECK_NUMBER } from '../Constants.js'

// 알람 탭
class AlarmView extends View {
    constructor($target) {
        super()        
        this.$element = $target
        this.$form = this.$element.querySelector('#formSection')
        this.$input = this.$form.querySelector('#inputAlarm')
        this.$buttonGetSample = this.$form.querySelector('#buttonGetSample')
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
        // sample 버튼
        this.$buttonGetSample.addEventListener('click', this.onClickGetSample)
        // 현재시간버튼
        this.$buttonGetTime.addEventListener('click', this.onClickGetTime)
        // 등록버튼
        this.$form.addEventListener('submit', this.onSubmitAlarm)
        // 삭제버튼
        this.$alarmList.addEventListener('click', this.onDeleteAlarm)
    }

    onInput = e => {
        // 숫자 + 콜론 정규식
        this.$input.value = this.$input.value.replace(REGEX_CHECK_NUMBER, '')

        // 콜론 생성
        if ( (!this.backSpaceMode && (this.$input.value.length === 2 || this.$input.value.length === 5))) {
            this.$input.value = `${this.$input.value}:`
        }

        //isValidate, 
        const [hour, min, sec] = this.$input.value.split(':')
        this.message.$element?.remove()

        if (Number(hour) >= 24) {    
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.HOUR_FORMAT)
            this.$input.value = ''
        }
        if (Number(min) >= 60) {
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.MIN_FORMAT)
            this.$input.value = `${hour}:`
        }
        if (Number(sec) >= 60) {
            this.message.render(this.$input.parentNode, 'warning', MESSAGE.SEC_FORMAT)
            this.$input.value = `${hour}:${min}:`
        } 
    }
    
    onKeyDown = e => {
        // 숫자&&주요키만 사용 가능
        if (Number(e.key) >= 0 && Number(e.key) < 10) {
            this.backSpaceMode = false
            return
        }
        if (WHITELIST.some(code => e.code === code)) {
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
        this.emit('@NOW')
    }

    onClickGetSample = () => {
        this.emit('@SAMPLE')
        //리스트가 생성되면 다시 이벤트 바인딩
        this.$alarmList.addEventListener('click', this.onDeleteAlarm) 
    }

    onSubmitAlarm = e => {
        e.preventDefault()
        //리스트가 생성되면 다시 이벤트 바인딩
        if(this.$alarmList.childNodes.length === 0) this.$alarmList.addEventListener('click', this.onDeleteAlarm) 
        this.$input.focus()
        this.emit('@ADD', {input: this.$input.value})
        this.$input.value = ''
    }

    onDeleteAlarm = e => {
        //리스트가 없어 삭제버튼 클릭이벤트 언바인딩
        if(this.$alarmList.childNodes.length === 0) this.off('click', this.$alarmList, this.onDeleteAlarm)
        if(e.target.id === 'buttonDelete') this.emit('@DELETE', {id: e.toElement.parentNode.id})
    }

    // 폼요소에 현재시각 렌더
    renderTime(currentTime) {
        const { hour, min, sec } = currentTime
        // 문자열이 2자리수, 그렇지 않으면 앞에 0 삽입
        const hourValue = String(hour).padStart(2, "0") 
        const minValue = String(min).padStart(2, "0")
        const secValue = String(sec).padStart(2, "0")

        this.$input.value = `${hourValue}:${minValue}:${secValue}`
    }

    // 알람목록 렌더
    renderList (list) {
        //유틸로 빼보자 지우는거 
        while (this.$alarmList.firstChild) {
            this.$alarmList.removeChild(this.$alarmList.firstChild)
        }


        //map
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
