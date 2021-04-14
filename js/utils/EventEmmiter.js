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
        if (this.events[eventName]) {
            for (var ii = 0; ii < this.events[eventName].length; ii++) {
                if (this.events[eventName][ii] === handler) {
                    this.events[eventName].splice(ii, 1);
                    break;
                }
            }
        }
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(handler) {
                handler(data);
            });
        }
    };
}
