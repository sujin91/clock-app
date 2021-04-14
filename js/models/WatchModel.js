import EventEmitter from '../utils/EventEmmiter.js'
import { Storage } from '../utils/Storage.js'

class WatchModel extends EventEmitter {
    constructor() {
        super()
        this.records = []
    }

    // 리스트 가져오기
    list() {
        return this.records
    }

    // 추가
    add(time) {
        const [hour, min, sec, msec] = time.replace('.', ':').split(':')
        const record = {
            id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
            time: {
                hour: hour,
                min: min,
                sec: sec,
                msec : msec
            },
        }

        this.records.push(record)
        this._commit(this.records)
    }

    // 리스트 전체 비우기
    clear() {
        this.records = []
        this._commit(this.records)
    }

    // 리스트 요소 삭제
    delete(id) {
        this.records = this.records.filter( item => item.id !== id)
        this._commit(this.records)
    }

    _commit(records) {
        Storage.set('records', records)
    }

    // 스톱워치 시작
    startWatch() {
        // 재시작으로 카운트 될 때 (endTime 확인)
        if(this.endTime > 0) this.startTime += Date.now() - this.endTime
        // 처음 눌려서 카운트 될 때 
        else this.startTime = Date.now() 

        this.setTimer()
    }

    setTimer() {
        this.watchTimer = setInterval( () => {
            this.watchTime = Date.now() - this.startTime
            this.emit('@TIMER', this.watchTime)
        }, 1)
    }

    // 스톱워치 멈춤 (일시정지 상태)
    stopWatch() {
        clearInterval(this.watchTimer)
        this.endTime = Date.now()
    }

    // 초기화 버튼 (기록중에)
    clearWatch() {
        clearInterval(this.watchTimer)
        this.endTime = 0
    }
}

export default WatchModel
