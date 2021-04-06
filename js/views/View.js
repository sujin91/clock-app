const tag = '[View]'

export default class View {
    // 이벤트 등록
    on(event, handler) {
        this.$element.addEventListener(event, handler)
        return this
    }

    emit(event, data) {
        const evt = new CustomEvent(event, { detail: data })
        this.$element.dispatchEvent(evt)
        return this
    }

    // 요소 노출,숨김
    hide = () => {
        this.$element.style.display = 'none'
        return this
    }

    show = () => {
        this.$element.style.display = 'block'
        return this
    }

    // 요소 생성
    createElement = (tag, className) => {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
    
        return element
    }

    // 알림메시지
    warningMessage = ($element, text) => {
        const $warning = this.createElement('p')
        $warning.innerHTML = text
        $warning.className = 'warning'

        //warning 존재하면 삭제
        $element.parentNode.querySelector('.warning')?.remove();
        $element.parentNode.append($warning)
    }

    successMessage = ($element, text) => {
        const $success = this.createElement('p')
        $success.innerHTML = text
        $success.className = 'success'

        //success 존재하면 삭제
        $element.parentNode.querySelector('.success')?.remove();
        $element.parentNode.append($success)
    }
}
