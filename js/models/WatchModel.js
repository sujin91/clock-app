import EventEmitter from '../utils/EventEmitter.js'
import { getTimeObj } from '../utils/time.js'
import { storage } from '../utils/storage.js'

class WatchModel extends EventEmitter {
    constructor() {
        super()
        this.records = new Map()
    }

    // 리스트 가져오기
    getList() {
        return this.records
    }

    // 추가
    add(time) {
        const [hour, min, sec, msec] = time.replace('.', ':').split(':')

        const record = {
            time: getTimeObj(hour, min, sec, msec),
        }

        this.records.set(Date.now(), record)
        this._commit(this.records)
    }

    // 리스트 전체 비우기
    clear() {
        this.records.clear()
        this._commit(this.records)
    }

    // 리스트 요소 삭제
    delete(id) {
        this.records.delete(id)
        this._commit(this.records)
    }

    _commit() {
        storage.set('RECORDS', this.records)
    }

    // 스톱워치 시작
    startWatch() {
        // 재시작으로 카운트 될 때
        if (this.endTime > 0) this.startTime += Date.now() - this.endTime
        // 처음 눌려서 카운트 될 때
        else this.startTime = Date.now()

        this.setTimer()
    }

    setTimer() {
        this.watchTimer = setInterval(() => {
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
