// Observer 패턴
export default class EventEmitter {
    constructor() {
        this.events = {}
    }

    // this.events 배열에 handler 등록
    on(eventName, handler) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(handler);
    }

    // this.events 배열에서 해당 handler 삭제
    destroy(eventName, handler) {
        if (this.events[eventName]) this.events.filter(item => item.handler !== handler)
    }

    // broadCast
    emit(eventName, data) {
        if (this.events[eventName]) this.events[eventName].forEach( handler => handler(data))
    }
}
