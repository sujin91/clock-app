// observer 패턴
export default class EventEmitter {
    constructor() {
        this.events = {}
    }

    on(eventName, handler) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(handler);
    }

    destroy(eventName, handler) {
        if (this.events[eventName]) this.events.filter(item => item.handler !== handler)
    }

    emit(eventName, data) {
        if (this.events[eventName]) this.events[eventName].forEach( handler => handler(data))
    }
}
