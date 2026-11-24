# ThingSpeak & IFTTT 연동을 통한 모바일 알림 구현

[ThingSpeak](https://thingspeak.mathworks.com/) 채널의 센서 데이터(가변저항값)가 설정한 임계치를 초과할 때, **ThingHTTP**와 **React** 앱을 거쳐 **IFTTT** Webhooks로 모바일 푸시 알림을 전송하는 IoT 연동 프로젝트입니다.

---

## 1. 시스템 구성 및 동작 흐름

```text
[API Request / 센서 데이터 입력]
        │  (field1 = 900 전송)
        ▼
[ThingSpeak Channel: my First Channel 
        │  (가변저항값 > 800 조건 충족 감지)
        ▼
[ThingSpeak React: variable resistor value becomes too high]
        │  (Trigger 실행)
        ▼
[ThingSpeak ThingHTTP: Too High Value in Pot Fleled]
        │  (IFTTT Webhook URL 호출)
        ▼
[IFTTT Applet (Webhooks → Notifications)]
        │
        ▼
[스마트폰 IFTTT 앱 알림 수신]

```

---

## 2. 단계별 구현 내용

### ① IFTTT Applet 생성 (Webhooks → Notifications)

1. **Trigger (If This):** `Webhooks` 서비스를 선택하고 `Receive a web request` 이벤트 이름을 지정합니다.
2. **Action (Then That):** `Notifications` 서비스를 선택하고 `Send a notification from the IFTTT app`을 통해 알림 메시지를 설정합니다.
3. Webhooks 설정 메뉴에서 발급된 **Webhook Trigger URL**을 확인합니다.

---

### ② ThingSpeak 채널 구성 (`my First Channel`)

* **설명:** 가변저항값과 스위치로 조절되는 LED 상태값 모니터링 채널
* **필드 구성:**
* `Field 1`: 가변저항값
* `Field 2`: LED 상태



---

### ③ ThingHTTP 및 React 연동 설정

#### 1) ThingHTTP 설정 (`Too High Value in Pot Fleled`)

* ThingSpeak의 **Apps > ThingHTTP**에서 IFTTT에서 발급받은 Webhook URL을 등록하여 조건 충족 시 외부 HTTP 요청을 전송하도록 연결합니다.

#### 2) React 조건 등록 (`variable resistor value becomes too high`)

ThingSpeak의 **Apps > React**에서 데이터 삽입 시점마다 임계치를 검사하도록 설정했습니다.

| 설정 항목 | 설정 값 | 설명 |
| --- | --- | --- |
| **React Name** | `variable resistor value becomes too high` | React 이벤트 이름 |
| **Condition Type** | `Numeric` | 수치형 데이터 비교 |
| **Test Frequency** | `On Data Insertion` | 채널에 새 데이터가 기록될 때마다 즉시 검사 |
| **Channel** | `my First Channel` | 모니터링 대상 채널 |
| **Field** | `1 (가변저항값)` | 검사할 데이터 필드 |
| **Condition** | `is greater than` `800` | 가변저항값이 **800 초과**일 때 조건 충족 |
| **Action** | `ThingHTTP` (`Too High Value in Pot Fleled`) | 조건 충족 시 실행할 ThingHTTP 요청 |
| **Options** | `Run action only the first time the condition is met` | 조건이 처음 충족되었을 때 1회 알림 실행 |

---

## 4. API Request 테스트 및 실행 결과

### ① API Request를 통한 데이터 기록

HTTP GET 요청을 통해 `Field 1`에 임계치(`800`)를 초과하는 값(`900`)을 전송하여 채널에 데이터를 기록했습니다.


### ② 채널 데이터 및 모바일 알림 확인

1. **ThingSpeak 채널 반영:** `my First Channel`의 **Field 1 Chart**와 게이지 위젯에 가변저항값 `900`이 정상적으로 표시되었습니다.
2. **IFTTT 모바일 알림 수신:** `900 > 800` 조건이 충족되어 React가 ThingHTTP를 호출했고, 스마트폰 IFTTT 앱으로 설정한 알림이 수신되는 것을 확인했습니다.

---

## 5. 실행 화면 캡처 (첨부 영역)

* **ThingHTTP 설정 화면:**
  
  <img width="300" height="300" alt="ThingHTTP" src="https://github.com/user-attachments/assets/1a6043ae-ad9f-4425-aa38-64c122bcf2ed" />
  
* **React 설정 화면:**
  
  <img width="300" height="380" alt="React" src="https://github.com/user-attachments/assets/0938874b-d007-4f25-b4ba-ffc413c7b5df" />
  
* **ThingSpeak 채널 그래프 (Field 1 = 900):**
  
  <img width="400" height="400" alt="my first channel" src="https://github.com/user-attachments/assets/0ffab2d8-6d31-40f0-b911-302db1b04ead" />`
  
* **스마트폰 IFTTT 알림 수신 화면:**
  
  <img width="300" height="600" alt="IFTTT" src="https://github.com/user-attachments/assets/51e2ea4d-df0a-4877-854f-393cd949de1e" />


```
