import { TabNames } from '../constants.js'

import ClockModel from '../models/ClockModel.js'
import AlarmModel from '../models/AlarmModel.js'
import WatchModel from '../models/WatchModel.js'

import TabView from '../views/TabView.js'
import AlarmView from '../views/AlarmView.js'
import ClockView from '../views/ClockView.js'
import WatchView from '../views/WatchView.js'

import { MessageView } from '../views/MessageView.js'
import { Message } from '../constants.js'

import Observable from '../utils/Observable.js'

class Controller extends Observable {
    constructor() {
        super()
        this.ClockModel = new ClockModel()
        this.AlarmModel = new AlarmModel()
        this.WatchModel = new WatchModel()

        this.TabView = new TabView(document.querySelector('.tab_area'))
        this.AlarmView = new AlarmView(document.querySelector('.alarm_area'))
        this.ClockView = new ClockView(document.querySelector('.clock_area'))
        this.WatchView = new WatchView(document.querySelector('.watch_area'))

        this.ClockModel.register('@CLOCK', this.handleClock, this)
        this.AlarmModel.register('@ALARM', this.handleAlarm, this)
        this.WatchModel.register('@WATCH', this.handleWatch, this)

        // 탭
        this.TabView
            .on('@change', e => this.onChangeTab(e.detail.tabName))

        // 알람
        this.AlarmView
            .on('@click', e => this.onGetTime())
            .on('@submit', e => this.onAddAlarm(e.detail.input))
            .on('@delete', e => this.onDeleteAlarm(e.detail.id))
            
        // 스탑워치
        this.WatchView
            .on('@reset', e => this.onResetTimerWatch())
            .on('@click', e => this.onAddRecord(e.detail.time))
            .on('@delete', e => this.onDeleteRecord(e.detail.id))

        // 처음 화면 렌더링
        this.ClockView.hide()
        this.AlarmView.hide()
        this.WatchView.hide()

        // 초기 탭
        this.selectedTab = TabNames.CLOCK
        this.ClockFlag = false
        this.onChangeTab(this.selectedTab)
    }

    handleClock(clock) {
        this.ClockView.render(clock)
    }
    
    handleAlarm(list) {
        this.AlarmView.renderList(list)
    }

    handleWatch(watch) {
        this.WatchView.renderStopWatch(watch)
    }

    onChangeTab(tabName) {
        this.selectedTab = tabName
        
        if (this.selectedTab === TabNames.CLOCK) {
            this.ClockView.render(this.ClockModel.getClock())
            this.AlarmFlag = this.AlarmModel.clearTimer()
            // this.WatchFlag = this.AlarmModel.clearTimer()
            
            this.ClockView.show()
            this.AlarmView.hide()
            this.WatchView.hide()

            if(this.ClockFlag === false) {
                this.ClockModel.setTimer()
                this.ClockFlag = true
            }
        } else if (this.selectedTab === TabNames.ALARM) {
            this.ClockView.render(this.ClockModel.getClock())
            this.AlarmView.renderList(this.AlarmModel.list())
            this.AlarmView.show()
            this.ClockView.show()
            this.WatchView.hide()

            if(this.ClockFlag === false) {
                this.ClockModel.setTimer()
                this.ClockFlag = true
            }
            if(this.AlarmFlag === false) {
                this.AlarmModel.setTimer()
                this.AlarmFlag = true
            }
        } else  { 
            this.AlarmView.hide()
            this.WatchView.show()
            this.AlarmFlag = this.AlarmModel.clearTimer()

            // 스톱워치 기록이 있으면 시계 Timer는 제거
            // 초기화 눌렀으면.. 스탑워치 뷰로 계속나오는게 날듯
            if(this.WatchModel.records.length > 0 || this.isInit === true) {
                this.ClockView.hide()
                this.WatchView.renderLastWatch(this.WatchModel.list())
                this.ClockFlag = this.ClockModel.clearTimer()
            }
        }
    }

    /* 알람 */
    // 현재시간 버튼 처리
    onGetTime() {
        this.AlarmView.renderTime(this.ClockModel.getClock())
    }

    // 등록 버튼 처리
    onAddAlarm(time) {
        //Message 존재하면 삭제
        document.querySelector('.warning')?.remove()
        document.querySelector('.success')?.remove()

        const isErrorText = this.AlarmModel.isError(time)
        
        if(isErrorText) {
            MessageView(document.querySelector('.alarm_area'), 'warning', isErrorText)
        } else {
            this.AlarmModel.add(time)
            this.AlarmView.renderList(this.AlarmModel.list())
            MessageView(document.querySelector('.alarm_area'), 'success', Message.SUCCESS)
        }
        
    }

    // 삭제 버튼 처리
    onDeleteAlarm(id) {
        this.AlarmModel.delete(id)   
        this.AlarmView.renderList(this.AlarmModel.list())
    }

    /* 스톱워치 */
    // 초기화 버튼 처리
    onResetTimerWatch() {
        // 시계/알람타이머 정지
        this.ClockFlag = this.ClockModel.clearTimer()
        this.AlarmFlag = this.AlarmModel.clearTimer()
        // 기록목록 전체삭제
        this.WatchModel.clear()
        
        // 00:00:00 렌더
        this.WatchView.renderReset()
        this.ClockView.hide()
        // 기록 목록 랜더
        this.WatchView.renderList(this.WatchModel.list())
        // 초기화 되었다는 플래그
        this.isInit = true
        // 기록 중에 초기화 누르면? 타이머정지
        this.WatchModel.clearWatch()
        this.isStop = true
        //Message 존재하면 삭제
        document.querySelector('.warning')?.remove()
        document.querySelector('.success')?.remove()
    }

    // 기록 버튼 처리
    onAddRecord(time) {
        // 초기화 안됐을 때
        if (!this.isInit) {
            MessageView(document.querySelector('.watch_area'), 'warning', Message.INIT)

            return
        }
        // 기록 시작할 때 (카운트 돔) 
        if (this.isStop) {
            // this.startWatch() 
            this.WatchModel.startWatch()
            this.isStop = false

            return
        }
        // 스탑워치 멈출 때 (카운트 멈춤)
        this.WatchModel.stopWatch()
        this.WatchModel.add(time)
        this.WatchView.renderList(this.WatchModel.list())
        MessageView(document.querySelector('.watch_area'), 'success', Message.SUCCESS)
        this.isStop = true
    }

    //삭제 버튼 처리
    onDeleteRecord(id) {
        this.WatchModel.delete(id)   
        this.WatchView.renderList(this.WatchModel.list())
    }
}

export default Controller
