export default class Observable {
    constructor() {
		this._observerList = {}
	}

	register(eventName, handler, context) {
		const handleArray = this._observerList[eventName] || []

		handleArray.push({ handler, context })
		this._observerList[eventName] = handleArray
	}

	unregister(eventName, handler, context) {
		const handlerArray = this._observerList[eventName] || []

		if (handlerArray.length === 0) {
			return
		}

		this._observerList[eventName] = handlerArray.filter(item => {
			return (item.handler !== handler || item.context !== context)
		})
	}

	notify(eventName, data) {
		const handlerArray = this._observerList[eventName]

		if (handlerArray.length === 0) {
			return
		}

		handlerArray.map(item => {
			item.handler.call(item.context, data)
		})
	}
}
