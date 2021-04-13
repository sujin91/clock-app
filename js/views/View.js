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

    // 언바인딩
    destroy(e, $element, handler) {
        $element.removeEventListener(e, handler)
        return this
    }

    hide() {
        this.$element.style.setProperty(`display`, `none`)
        return this
    }

    show() {
        this.$element.style.getPropertyValue(`display`) === `none` && this.$element.style.setProperty(`display`, `block`)
        return this
    }

    // 요소 생성
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
    
        return element
    }
}
