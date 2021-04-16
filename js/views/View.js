import EventEmitter from "../utils/EventEmitter.js"

// View에서는 EventEmitter대신 CustomEvent로 Observer
export default class View {
    // 나눌까말까
    // 이벤트 등록
    on(eventName, handler) {
        this.$element.addEventListener(eventName, handler)
        return this
    }

    // 언바인딩
    off(eventName, $element, handler) {
        $element.removeEventListener(eventName, handler)
        return this
    }

    emit(eventName, data) {
        const evt = new CustomEvent(eventName, { detail: data })
        this.$element.dispatchEvent(evt)
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
    createElement(tagName, className, id) {
        const $element = document.createElement(tagName)
        className && $element.classList.add(className)
        if(id) $element.id = id

        return $element
    }
}
