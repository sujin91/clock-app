import View from './View.js'
import MessageView from '../views/MessageView.js'
import { WHITELIST, MESSAGE, BTN_DELETE, COLOR, STATE } from '../Constants.js'
import { getTimeStrObj } from '../utils/time.js'

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

    onInput = (e) => {
        // 숫자 + 콜론 정규식
        const regex = /[^0-9:]/gi
        this.$input.value = this.$input.value.replace(regex, '')

        // 자동 콜론 생성 (backspaceMode가 아닐때)
        if (
            !this.backSpaceMode &&
            (this.$input.value.length === 2 || this.$input.value.length === 5)
        ) {
            this.$input.value = `${this.$input.value}:`
        }

        this.isErrorFormat()
    }

    onKeyDown = (e) => {
        // 숫자&&주요키만 사용 가능
        if (Number(e.key) >= 0 && Number(e.key) < 10) {
            this.backSpaceMode = false
            return
        }
        if (WHITELIST.some((code) => e.code === code)) {
            this.backSpaceMode = false
            return
        }
        if (e.key === 'Backspace') {
            // Backspace 처리 flag
            this.backSpaceMode = true
            return
        }

        e.preventDefault()
    }

    // 시간 Format 유효성 검사
    isErrorFormat() {
        const [hour, min, sec] = this.$input.value.split(':')
        let warningMessage = ''
        this.message.$element?.remove()

        // 24시 60분 60초 이상 입력시 입력값 자동 삭제 처리
        if (Number(hour) >= 24) {
            warningMessage = MESSAGE.HOUR_FORMAT
            this.$input.value = ''
        }
        if (Number(min) >= 60) {
            warningMessage = MESSAGE.MIN_FORMAT
            this.$input.value = `${hour}:`
        }
        if (Number(sec) >= 60) {
            warningMessage = MESSAGE.SEC_FORMAT
            this.$input.value = `${hour}:${min}:`
        }

        this.message.render(this.$input.parentNode, 'warning', warningMessage)
    }

    onClickGetTime = () => {
        this.$input.focus()
        this.emit('@NOW') // 현재시간 버튼 클릭 broadcast
    }

    onClickGetSample = () => {
        this.emit('@SAMPLE') // 샘플 버튼 클릭 broadcast
        // 리스트가 생성되면 다시 이벤트 바인딩
        this.$alarmList.addEventListener('click', this.onDeleteAlarm)
    }

    onSubmitAlarm = (e) => {
        e.preventDefault()
        // 리스트가 생성되면 다시 이벤트 바인딩
        if (this.$alarmList.childNodes.length === 0)
            this.$alarmList.addEventListener('click', this.onDeleteAlarm)

        this.emit('@ADD', { input: this.$input.value }) // Submit(엔터, 등록) broadcast
        this.$input.value = '' // 등록 후 인풋 초기화
        this.$input.focus()
    }

    onDeleteAlarm = (e) => {
        //리스트요소 개수가 0이되면 삭제버튼 클릭이벤트 언바인딩
        if (this.$alarmList.childNodes.length === 0)
            this.off('click', this.$alarmList, this.onDeleteAlarm)

        if (e.target.id === 'buttonDelete')
            this.emit('@DELETE', { id: Number(e.toElement.parentNode.id) }) // 삭제 버튼 클릭 broadcast
    }

    // 폼요소에 현재시각 렌더
    renderTime(currentTime) {
        const { time } = currentTime
        const { hour, min, sec } = getTimeStrObj(time)

        this.$input.value = `${hour}:${min}:${sec}`
    }

    // 알람목록 렌더
    renderList(list) {
        this.clearChildElement(this.$alarmList)

        for (let [key, value] of list.entries()) {
            const $li = this.createElement('li')
            $li.id = key

            const $span = this.createElement('span')
            $span.innerHTML = `${value.time.hour}:${value.time.min}:${value.time.sec}`

            value.state === STATE.PENDING &&
                $span.style.setProperty('color', COLOR.BLACK)
            value.state === STATE.EXPIRED &&
                $span.style.setProperty('color', COLOR.GRAY)
            value.state === STATE.ACTIVE &&
                $span.style.setProperty('color', COLOR.RED)

            const $button = this.createElement('button', 'button_delete')
            $button.id = 'buttonDelete'
            $button.innerHTML = BTN_DELETE

            $li.append($span, $button)
            this.$alarmList.append($li)
        }

        this.$alarmCount.innerHTML = `총: ${list.size}`
    }
}

export default AlarmView
