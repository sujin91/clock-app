import Controller from './controllers/Controller.js'

import AlarmModel from './models/AlarmModel.js'
import WatchModel from './models/WatchModel.js'

import View from './views/View.js'
import TabView from './views/TabView.js'
import AlarmView from './views/AlarmView.js'
import ClockView from './views/ClockView.js'
import WatchView from './views/WatchView.js'

function App() {
    console.log('app create')

    const app = new Controller({
        model: { AlarmModel, WatchModel },
        view: { View, TabView, AlarmView, ClockView, WatchView},
    })
}

new App()
