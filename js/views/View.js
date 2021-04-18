/**
 * View 컴포넌트가 공통으로 사용하는 메서드 정의,
 * CustomEvent/dispatch가 Observer 패턴으로 사용됨
 */
export default class View {
    // 이벤트와 handler 등록
    on(eventName, handler) {
        this.$element.addEventListener(eventName, handler)
        return this
    }

    // 언바인딩
    off(eventName, $element, handler) {
        $element.removeEventListener(eventName, handler)
        return this
    }

    // broadCast
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
        this.$element.style.getPropertyValue(`display`) === `none` &&
            this.$element.style.setProperty(`display`, `block`)
        return this
    }

    // 요소 생성
    createElement(tagName, className, id) {
        const $element = document.createElement(tagName)
        className && $element.classList.add(className)
        if (id) $element.id = id

        return $element
    }

    // 자식 요소 비움
    clearChildElement($target) {
        while ($target.firstChild) {
            $target.removeChild($target.firstChild)
        }
    }
}
