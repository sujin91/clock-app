/**
 * Observer 패턴의 메서드 정의 (Model에서 사용)
 */
export default class Observable {
    constructor() {
        this.events = {}
    }

    // this.events 배열에 handler 등록
    on(eventName, handler) {
        this.events[eventName] = this.events[eventName] || []
        this.events[eventName].push(handler)
    }

    // this.events 배열에서 해당 handler 삭제
    off(eventName, handler) {
        if (this.events[eventName])
            this.events.filter((item) => item.handler !== handler)
    }

    // broadCast
    emit(eventName, data) {
        if (this.events[eventName])
            this.events[eventName].map((handler) => handler(data))
    }
}
