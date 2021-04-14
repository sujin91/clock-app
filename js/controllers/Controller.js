import ClockModel from '../models/ClockModel.js'
import AlarmModel from '../models/AlarmModel.js'
import WatchModel from '../models/WatchModel.js'

import TabView from '../views/TabView.js'
import AlarmView from '../views/AlarmView.js'
import ClockView from '../views/ClockView.js'
import WatchView from '../views/WatchView.js'
import MessageView from '../views/MessageView.js'

import Observable from '../utils/Observable.js'
import { TAB_NAMES } from '../constants.js'
import { MESSAGE } from '../constants.js'

class Controller extends Observable {
    constructor() {
        super()
        this.clockModel = new ClockModel()
        this.alarmModel = new AlarmModel()
        this.watchModel = new WatchModel()

        this.tabView = new TabView(document.querySelector('#tabArea'))
        this.alarmView = new AlarmView(document.querySelector('#alarmArea'))
        this.clockView = new ClockView(document.querySelector('#clockArea'))
        this.watchView = new WatchView(document.querySelector('#watchArea'))
        this.messageView = new MessageView()

        this.clockModel.register('@CLOCK', this.handleClock, this)
        this.alarmModel.register('@ALARM', this.handleAlarm, this)
        this.watchModel.register('@WATCH', this.handleWatch, this)

        this.tabView
            .on('@CHANGE', e => this.onChangeTab(e.detail.tabName))

        this.alarmView
            .on('@CLICK', e => this.onGetTime())
            .on('@ADD', e => this.onAddAlarm(e.detail.input))
            .on('@DELETE', e => this.onDeleteAlarm(e.detail.id))
            
        this.watchView
            .on('@RESET', e => this.onResetTimerWatch())
            .on('@ADD', e => this.onAddRecord(e.detail.time))
            .on('@DELETE', e => this.onDeleteRecord(e.detail.id))

        // 초기 화면 
        this.clockView.hide()
        this.alarmView.hide()
        this.watchView.hide()
        this.clockFlag = false

        // 탭
        this.onChangeTab(TAB_NAMES.CLOCK)
    }

    handleClock(clock) {
        this.clockView.render(clock)
    }

    handleAlarm(list) {
        this.alarmView.renderList(list)
    }

    handleWatch(watch) {
        this.watchView.renderStopWatch(watch)
    }

    onChangeTab(tabName) {
        this.selectedTab = tabName
        
        // 시계 탭
        if (this.selectedTab === TAB_NAMES.CLOCK) {
            this.clockView.render(this.clockModel.getClock())
            this.alarmFlag = this.alarmModel.clearTimer()
            
            this.clockView.show()
            this.alarmView.hide()
            this.watchView.hide()

            if (!this.clockFlag) {
                this.clockModel.setTimer()
                this.clockFlag = true
            }
        } 
        // 알람 탭
        else if (this.selectedTab === TAB_NAMES.ALARM) {
            this.clockView.render(this.clockModel.getClock())
            this.alarmView.renderList(this.alarmModel.list())

            this.alarmView.show()
            this.clockView.show()
            this.watchView.hide()

            if(!this.clockFlag) {
                this.clockModel.setTimer()
                this.clockFlag = true
            }

            if(!this.alarmFlag) {
                this.alarmModel.setTimer()
                this.alarmFlag = true
            }
        } 
        // 스탑워치 탭
        else  { 
            this.alarmView.hide()
            this.watchView.show()

            this.alarmFlag = this.alarmModel.clearTimer()

            // 스톱워치 기록 존재 || 초기화 눌렀으면 clockView hide
            if (this.watchModel.records.length > 0 || this.isInit === true) {
                this.clockView.hide()
                this.watchView.renderLastWatch(this.watchModel.list())
                this.clockFlag = this.clockModel.clearTimer()
            }
        }
    }

    /* 알람 */
    // 현재시간 버튼 처리
    onGetTime() {
        this.alarmView.renderTime(this.clockModel.getClock())
    }

    // 등록 버튼 처리
    onAddAlarm(time) {
        //Message 존재하면 삭제
        this.messageView.$element?.remove()
        const isErrorText = this.alarmModel.isError(time)
        
        if(isErrorText) {
            this.messageView.render(document.querySelector('#formSection'), 'warning', isErrorText)
        } else {
            this.alarmModel.add(time)
            this.alarmView.renderList(this.alarmModel.list())
            this.messageView.render(document.querySelector('#formSection'), 'success', MESSAGE.SUCCESS)
        }
    }

    // 삭제 버튼 처리
    onDeleteAlarm(id) {
        this.alarmModel.delete(id)   
        this.alarmView.renderList(this.alarmModel.list())
    }

    /* 스톱워치 */
    // 초기화 버튼 처리
    onResetTimerWatch() {
        // 시계/알람타이머 정지
        this.clockFlag = this.clockModel.clearTimer()
        this.alarmFlag = this.alarmModel.clearTimer()
        // 기록목록 전체삭제
        this.watchModel.clear()
        
        // 00:00:00 렌더
        this.watchView.renderReset()
        this.clockView.hide()
        // 기록 목록 랜더
        this.watchView.renderList(this.watchModel.list())
        // 초기화 되었다는 플래그
        this.isInit = true
        // 기록 중에 초기화 누르면? 타이머정지
        this.watchModel.clearWatch()
        this.isStop = true
        //Message 존재하면 삭제
        this.messageView.$element?.remove()
    }

    // 기록 버튼 처리
    onAddRecord(time) {
        // 초기화 안됐을 때
        if (!this.isInit) {
            this.messageView.render(document.querySelector('#watchSection'), 'warning', MESSAGE.INIT)

            return
        }
        // 기록 시작할 때 (카운트 돔) 
        if (this.isStop) {
            // this.startWatch() 
            this.watchModel.startWatch()
            this.isStop = false

            return
        }
        // 스탑워치 멈출 때 (카운트 멈춤)
        this.watchModel.stopWatch()
        this.watchModel.add(time)
        this.watchView.renderList(this.watchModel.list())
        this.messageView.$element?.remove()
        this.messageView.render(document.querySelector('#watchSection'), 'success', MESSAGE.SUCCESS)
        this.isStop = true
    }

    //삭제 버튼 처리
    onDeleteRecord(id) {
        this.watchModel.delete(id)   
        this.watchView.renderList(this.watchModel.list())
    }
}

export default Controller
