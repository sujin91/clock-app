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
    
    //현재 시간
    getCurrentTime = () => {
        const currentDate = new Date() 
        const currentTime = {
            date: currentDate.getDate(),
            hour: currentDate.getHours(),
            min: currentDate.getMinutes(),
            sec: currentDate.getSeconds()
        }
        return currentTime
    }

    // 알람폼에 있는 시간
    getInputTime = () => {
        const TimeStr = this.$inputEl.value.split(':')
        const inputTime = {
            hour: TimeStr[0],
            min: TimeStr[1],
            sec: TimeStr[2]
        }
        return inputTime
    }

    isError = (alarms) => {
        const currentTime = this.getCurrentTime()
        const inputTime = this.getInputTime()

        // 초로 변환
        const currentSeconds = currentTime.hour * 60 * 60 + currentTime.min * 60 + currentTime.sec
        const inputSeconds = Number(inputTime.hour) * 60 * 60 + Number(inputTime.min) * 60 + Number(inputTime.sec)
        
        // 빈자리 있는지 확인
        const isEmpty = this.$inputEl.value.length < 8 ? true : false;

        // 과거 시간인지 확인
        const isPast = inputSeconds - currentSeconds < 0 ? true : false;

        // 존재하는 알람인지 확인
        const isExist = alarms.some( item => item.seconds === inputSeconds )

        // View에서 상속받은 공통 알림 메시지 메서드
        if(isEmpty) {
            this.warningMessage(this.$buttonAddAlarm, '시간 형식에 맞게 입력해주세요.')
        }
        else if(isExist) {
            this.warningMessage(this.$buttonAddAlarm, '이미 존재하는 알람입니다.')
        }
        else {
            isPast && this.warningMessage(this.$buttonAddAlarm, '과거시간은 알람을 등록할 수 없습니다.')
        }
        
        // 둘중 하나라도 유효하지 않으면 isError는 TRUE
        return isExist || isPast || isEmpty
    }

    bindEvents = () => {
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

    onKeyUp = (e) => {
        const inputTime = this.getInputTime()

        if(inputTime.hour > 23 || inputTime.min > 59 || inputTime.sec > 59) {
            this.warningMessage(this.$buttonAddAlarm, '24시/60분/60초를 넘길 수 없습니다')
            this.$inputEl.value = this.$inputEl.value.substr(0, this.$inputEl.value.length - 1);
        }

        e.keyCode === 13 && this.emit('@submit', {input: this.$inputEl.value})
    }

    // 숫자, 주요키만 사용 가능
    filterNumber = e => {
        if (e.keyCode > 47 && e.keyCode < 58) {
            this.isDeleteMode = false
            return
        }
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return 
        }
        if (e.keyCode === 9 || e.keyCode === 36 || e.keyCode === 35 || e.keyCode === 37 ||
            e.keyCode === 39 || e.keyCode === 46) {
            return
        }
        if ( e.keyCode === 8 ) {
            this.isDeleteMode = true
            return
        }
        e.preventDefault();
    }
    
    onKeyDown = (e) => {
        const enter = 13
        const backspace = 8
        const shift = 186

        // 숫자&&명령어만 사용 가능
        this.filterNumber(e)
        
        // 자동 콜론 생성
        if( (!this.isDeleteMode && (this.$inputEl.value.length === 2 || this.$inputEl.value.length === 5))) {
            this.$inputEl.value = `${this.$inputEl.value}:`
        }

        // 콜론지울 때 처리
        if(e.keyCode === 8 && (this.$inputEl.value.length === 4 || this.$inputEl.value.length === 7) ) {
            this.$inputEl.value = this.$inputEl.value.substr(0, this.$inputEl.value.length - 1);    
        }
    }

    // 현재시간
    onClickGetTime = () => {
        this.$inputEl.focus();
        this.emit('@click')
    }

    // 등록
    onClickAddAlarm = () => {
        this.$inputEl.focus();
        this.emit('@submit', {input: this.$inputEl.value})
    }

    // 삭제
    onClickDeleteAlarm = e => this.emit('@delete', {id: e.toElement.parentNode.id})

    // 폼요소에 현재시각 렌더
    renderTime = () => {
        const currentTime = this.getCurrentTime()
        //문자열이 2자리수, 그렇지 않으면 앞에 0 삽입
        const hour = String(currentTime.hour).padStart(2, "0") 
        const min = String(currentTime.min).padStart(2, "0")
        const sec = String(currentTime.sec).padStart(2, "0")

        this.$inputEl.value = `${hour}:${min}:${sec}`
    }

    // 알람목록 렌더
    renderList = list => {
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
