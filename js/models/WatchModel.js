class WatchModel {
    constructor() {
        this.myStorage = window.localStorage;
        // 생성될 때 기록 초기화
        this.records = []
    }

    // 리스트 가져오기
    list = () => this.records

    // 추가
    add = time => {
        const TimeStr = time.replace('.', ':').split(':')
        const record = {
            id: this.records.length > 0 ? this.records[this.records.length - 1].id + 1 : 1,
            time: {
                hour: TimeStr[0],
                min: TimeStr[1],
                sec: TimeStr[2],
                msec : TimeStr[3]
            },
        }

        this.records.push(record)
        this._commit(this.records)
    }

    // 리스트 전체 비우기
    clear = () => {
        this.records = [];
        this._commit(this.records)
    }

    // 리스트 요소 삭제
    delete = id => {
        this.records = this.records.filter( item => item.id !== id)
        this._commit(this.records)
    }

    _commit = records => {
        this.myStorage.setItem('records', JSON.stringify(this.records))
    }
}

export default WatchModel
