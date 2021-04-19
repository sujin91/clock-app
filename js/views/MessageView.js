import View from './View.js'

class MessageView extends View {
    constructor() {
        super()
    }

    // 등록, 주의 메시지 렌더
    render($target, className, text) {
        this.$element = this.createElement('p')
        this.$element.innerHTML = text
        this.$element.className = className

        $target.append(this.$element)
    }
}

export default MessageView
