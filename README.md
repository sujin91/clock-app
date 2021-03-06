## Clock-App

-   Vanilla JS with Clock App

### 실행방법

1. `npm install lite-server -g`
2. `lite-server` 실행
3. `localhost:3000`, terminal에 표시된 `PORT` 번호 확인 후 접속

### 설계

-   이 앱은 MVC 모델을 기반으로 설계하였으며 옵저버패턴을 이용하여 MVC의 단점인 View와 Model의 의존성을 제거하였습니다.
-   Model은 데이터를 관리하고 데이터의 상태변화를 Broadcast 하여 Controller에게 전달합니다.
-   View는 사용자의 입력을 받고 이벤트를 Broadcast 하여 Controller에게 전달합니다.
    ![](./my_pattern.png)

### 구조

-   index.html
-   css/
-   js/
    -   controllers/
    -   models/
    -   utils/
    -   views/
    -   App.js
    -   constants.js
    -   sample.json

#### models

-   `ClockModel.js` : Date객체를 사용하여 현재 시간 데이터를 관리하는 모델
-   `AlarmModel.js` : ClockModel을 상속받아 현재 시간을 공유하고 알람 데이터를 관리하는 모델
-   `WatchModel.js` : Date객체의 `now()`를 활용하여 스톱워치 데이터를 만들고 스톱워치 데이터를 관리하는 모델
-   전체 모델은 `Observable.js`를 상속받아 데이터가 변경됨을 감지하여 `Controller`에게 알림

#### views

-   `ClockView.js` : 시계 컴포넌트 렌더
-   `AlarmView.js` : 알람 컴포넌트(입력폼, 알람 리스트) 렌더
-   `WatchView.js` : 스톱워치 컴포넌트(스톱워치, 스톱워치 리스트) 렌더
-   `MessageView.js` : success, warning 메시지 컴포넌트 렌더
-   `TabView.js` : 탭 컴포넌트 렌더
-   `View.js` : 뷰 컴포넌트에만 상속시킬 공통 메서드 정의
    -   `on()` : 이벤트 바인딩
    -   `off()`: 이벤트 언바인딩
    -   `emit()` : 커스텀 이벤트 생성, 디스패치, detail 프로퍼티로 데이터 전달
    -   `show(), hide()` : 뷰 단위로 노출/비노출
    -   `createElement()` : 요소생성
    -   `clearChildElement()` : 자식요소 전체삭제
-   전체 뷰는 커스텀이벤트를 생성/디스패치를 상속받아 이벤트를 감지하여 `Controller`에게 알림

#### Controllers

-   `Controller.js`
    -   Model과 View사이의 매개체
    -   Model과 View사이에서 자료 전달 역할

#### utils

-   `EventEmmiter.js`: 옵저버(감시자) 패턴 구현
    -   `on()`: 감지에 연결될 handler 등록
    -   `off()`: 감지에 등록된 handler 제거
    -   `emit()`: 감지 발생시 broadcast
-   `fetchData.js`: path의 data를 fetch함 (`try...catch`)
-   `refineData.js`: fetch된 데이터를 정제함
    -   `id`: 시분초를 초단위로 계산하여 값 정제
    -   `date`: 자정이 되면 사라지기 때문에 오늘날짜로 정제
    -   `time`: 시분초값을 `padStart()`를 사용한 문자열로 정제
-   `storage.js`: `window.localstorage`를 get, set (`try...catch`)
-   `time.js`: 시간 계산 관련 메서드
    -   `calcSeconds()`: 초단위로 반환
    -   `getTimeObj()`: 시분초(밀리초)를 담은 Object로 반환
    -   `getTimeStrObj()`: 시분초(밀리초)를 `padStart()`를 사용한 문자열로 반환

#### Contsant.js

-   `magic string` 관리

### 기능 설명

-   시계
    -   현재시간
-   알람
    -   시계 // 설계서에는 노출되지 않고 있는데 사용자 관점에서 필요할 것 같아 두었습니다. (show, hide 가능합니다)
    -   알람 Form
        -   현재 시간 가져오기
        -   알람 등록
            -   알람 시간 별 오름차순 등록
            -   유효성 검사
                -   24시 60분 60초 이상 작성 불가
                -   영어 한글 특수기호 작성 불가
                -   복붙 가능
                -   과거시간 알람 등록 불가
                -   중복시간 알람 등록 불가
        -   샘플 데이터 불러오기
            -   async, await을 이용한 비동기 호출
            -   샘플 데이터 정제
    -   알람 리스트
        -   시간 감지 후 상태 변화
            -   과거알람(GRAY), 알람10초전(RED), 미래알람(BLACK)
        -   등록한 알람 선택 삭제
        -   자정 이후 알람 전체 삭제
        -   총 알람갯수
        -   리스트 없을시 삭제버튼 이벤트 언바인딩
-   스톱워치
    -   시계
        -   스톱워치 기록이 없을 경우 보여짐
    -   초기화
        -   스톱워치가 00:00:00 으로 초기화
        -   스톱워치 기록 전체 삭제
    -   기록
        -   밀리세컨드 단위로 스톱워치 작동
        -   스톱워치 멈추면서 기록 리스트에 저장/삭제
        -   스톱워치 작동 중에 탭 이동시 스톱워치 유지
        -   총 기록갯수
        -   리스트 없을시 삭제버튼 이벤트 언바인딩

### ETC
- 자료구조: `map`
- `keyCode`(deprecated) 대신 `key` 사용
