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

import Timer from '../utils/Timer.js'

class Controller {
    constructor() {
        this.ClockModel = new ClockModel()
        this.AlarmModel = new AlarmModel()
        this.WatchModel = new WatchModel()

        this.TabView = new TabView(document.querySelector('.tab_area'))
        this.AlarmView = new AlarmView(document.querySelector('.alarm_area'))
        this.ClockView = new ClockView(document.querySelector('.clock_area'))
        this.WatchView = new WatchView(document.querySelector('.watch_area'))
        
        // this.timer = new Timer()
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
        this.selectedTab = TabNames.CLOCK
        this.renderView()        
    }

    renderView = () => {
        // 탭 선택
        this.TabView.setActiveTab(this.selectedTab)

        // 초기 탭
        this.ClockView.show()
        this.AlarmView.hide()
        this.WatchView.hide()

        // 스톱워치 카운트 중에 탭이동했을 경우
        clearInterval(this.watchTimer)

        if (this.selectedTab === TabNames.CLOCK) {
            //todo observer
            this.clockTimer = setInterval( () => {
                this.ClockView.render(this.ClockModel.getClock())
            }, 1000);
            
        } else if (this.selectedTab === TabNames.ALARM) {
            this.AlarmView.show()

            // 타이머
            // this.setTimerClock()
            this.setTimerAlarm()

            // 알람리스트
            this.AlarmView.renderList(this.AlarmModel.list())
        } else if (this.selectedTab === TabNames.STOPWATCH) {
            this.WatchView.show()
            
            //타이머
            this.setTimerWatch()
            
            //스톱워치
            this.WatchView.renderLastWatch(this.WatchModel.list())

            //스톱워치 기록리스트
            this.WatchView.renderList(this.WatchModel.list())
        }
    }

    onChangeTab = tabName => {
        this.selectedTab = tabName
        this.renderView()
    }

    //시계 timer 설정
    setTimerClock = () => {
        // 타이머 중복 방지
        this.clockTimer && clearInterval(this.clockTimer)

        this.clockTimer = setInterval(this.ClockView.render, 1000);
        this.alarmTimer = clearInterval(this.alarmTimer)
    }

    //알람 timer 설정
    setTimerAlarm = () => {
        // 타이머 중복 방지
        this.alarmTimer && clearInterval(this.alarmTimer)
        
        this.alarmTimer = setInterval(() => {
            this.AlarmModel.changeState()
            this.AlarmView.renderList(this.AlarmModel.list())
        }, 1000)
    }

    //스탑워치 timer 설정
    setTimerWatch = () => {
        // 스톱워치 기록이 있으면 시계 Timer는 제거
        if(this.WatchModel.records.length > 0) {
            this.clockTimer && clearInterval(this.clockTimer)
            this.isInit = true;
        }
        else this.isInit = false
    }

    /* 알람 */
    // 현재시간 버튼 처리
    onGetTime = () => {
        this.AlarmView.renderTime(this.ClockModel.getClock())
    }

    // 등록 버튼 처리
    onAddAlarm = time => {
        //Message 존재하면 삭제
        document.querySelector('.warning')?.remove();
        document.querySelector('.success')?.remove();

        if(!this.AlarmModel.isError(this.AlarmView.getInputTime())) {
            this.AlarmModel.add(time)
            this.AlarmView.renderList(this.AlarmModel.list())
            MessageView(document.querySelector('.alarm_area'), 'success', Message.SUCCESS)
        }
    }

    // 삭제 버튼 처리
    onDeleteAlarm = id => {
        this.AlarmModel.delete(id)   
        this.AlarmView.renderList(this.AlarmModel.list())
    }

    /* 스톱워치 */
    // 초기화 버튼 처리
    onResetTimerWatch = () => {
        // 기록목록 전체삭제
        this.WatchModel.clear()
        // 시계/알람타이머 정지
        clearInterval(this.clockTimer)
        clearInterval(this.watchTimer)
        // 00:00:00 렌더
        this.WatchView.renderReset()
        // 기록 목록 랜더
        this.WatchView.renderList(this.WatchModel.list())
        // 지난기록 초기화
        this.endTime = 0
        // 초기화 되었다는 플래그
        this.isInit = true;
        // 기록 중에 초기화 누르면?
        this.isStop = true;
        //Message 존재하면 삭제
        document.querySelector('.warning')?.remove();
        document.querySelector('.success')?.remove();
    }

    // 스톱워치 시작
    startWatch = () => {
        // 재시작으로 카운트 될 때 (endTime 확인)
        if(this.endTime > 0) this.startTime += Date.now() - this.endTime
        // 처음 눌려서 카운트 될 때 
        else this.startTime = Date.now() 

        this.isStop = false;

        this.watchTimer = setInterval( () => {
            this.watchTime = Date.now() - this.startTime
            this.WatchView.renderStopWatch(this.watchTime)
        }, 1)
    }

    // 스톱워치 멈춤 (일시정지 상태)
    stopWatch = () => {
        this.isStop = true;
        clearInterval(this.watchTimer)
        this.endTime = Date.now()
    }

    // 기록 버튼 처리
    onAddRecord = (time) => {
        // debugger
        // 초기화 안됐을 때
        if (!this.isInit) MessageView(document.querySelector('.watch_area'), 'warning', Message.INIT)
        // 기록 시작할 때 (카운트 돔) 
        else if (this.isInit && this.isStop) this.startWatch() 
        // 스탑워치 멈출 때 (카운트 멈춤)
        else {
            this.stopWatch()
            this.WatchModel.add(time)
            this.WatchView.renderList(this.WatchModel.list())
            MessageView(document.querySelector('.watch_area'), 'success', Message.SUCCESS)
        }
    }

    //삭제 버튼 처리
    onDeleteRecord = id => {
        this.WatchModel.delete(id)   
        this.WatchView.renderList(this.WatchModel.list())
    }
}
export default Controller