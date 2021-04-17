export const TAB_NAMES = {
    CLOCK: '시계',
    ALARM: '알람',
    STOPWATCH: '스톱워치',
}

export const MESSAGE = {
    EMPTY: '시간 형식에 맞게 입력해주세요.',
    EXIST: '이미 존재하는 알람입니다.',
    PAST: '과거시간은 알람을 등록할 수 없습니다.',
    INIT: '초기화 해주세요.',
    HOUR_FORMAT: '24시를 넘길 수 없습니다',
    MIN_FORMAT: '60분을 넘길 수 없습니다',
    SEC_FORMAT: '60초를 넘길 수 없습니다',
    SUCCESS: '등록하였습니다.',
    STORAGE_FAIL: 'localStorage를 사용할 수 없습니다.',
}

export const STATE = {
    EXPIRED: 'expired',
    ACTIVE: 'active',
    PENDING: 'pending',
}

export const COLOR = {
    RED: '#F00',
    GRAY: '#888',
    BLACK: '#000',
}

// 상수는 객체고
export const WHITELIST = [
    'Control',
    'Alt',
    'Meta',
    'ArrowLeft',
    'ArrowRight',
    'Enter',
    'Tab',
    'Home',
    'End',
    'Delete',
]
export const BTN_GET_TIME = '현재시간'
export const BTN_ADD = '등록'
export const BTN_RESET = '초기화'
export const BTN_RECORD = '기록'
export const BTN_DELETE = '삭제'
export const INIT_TIMESTAMP = '00:00:00'
export const NAMESPACE = 'clock-app_'
export const SAMPLE_JSON = 'sample.json'
// export const REGEX_CHECK_NUMBER = /[^0-9:]/gi
// export const REGEX_CHECK_FORMAT = /^[0-9]{2,2}:[0-9]{2,2}:[0-9]{2,2}$/g
