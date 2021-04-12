export const SECOND = 1000; // 1s

export const TabNames = {
    CLOCK: '시계',
    ALARM: '알람',
    STOPWATCH: '스톱워치',
}

export const Key = {
    // Backspace
    ENTER: 13,
    BACKSPACE: 8,
    SHIFT: 186,
}

export const Message = {
    EMPTY: '시간 형식에 맞게 입력해주세요.',
    EXIST: '이미 존재하는 알람입니다.',
    PAST: '과거시간은 알람을 등록할 수 없습니다.',
    INIT: '초기화 해주세요.',
    FORMAT: '24시/60분/60초를 넘길 수 없습니다',
    SUCCESS: '등록하였습니다.'
}

export const State = {
    EXPIRED: 'expired',
    ACTIVE: 'active',
    PENDING: 'pending',
}