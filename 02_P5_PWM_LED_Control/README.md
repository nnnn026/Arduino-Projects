#  Web Serial 기반 아두이노 PWM LED 밝기 제어 실습

p5.js의 세로 슬라이더 UI를 이용하여 웹 브라우저에서 아두이노 9번 핀 LED의 밝기를 실시간으로 제어하는 프로젝트입니다.

---

##  주요 특징 (Key Features)
* **웹-아두이노 연동**: Web Serial API를 활용한 양방향 시리얼 통신
* **통신 최적화**: `Math.abs()` 함수를 활용하여 슬라이더 값이 이전 전송값 대비 **5 이상 변화할 때만 데이터 전송** (불필요한 시리얼 트래픽 차단)
* **직관적인 UI**: p5.js 세로 슬라이더 및 실시간 0~255 수치 시각화

---

##  회로 구성 (Circuit Diagram)
<img width="1184" height="1022" alt="circuit_d9_led" src="https://github.com/user-attachments/assets/68035a8f-7fd3-4a22-8d66-69c495502f3b" />

* **Arduino Uno D9** ➔ `LED (+)`
* **LED (-)** ➔ `330Ω 저항` ➔ **Arduino GND**


---

## 스케치  (p5.js ↔ Arduino)

Web Serial API와 `TaskScheduler` 라이브러리를 활용하여 **p5.js 웹 인터페이스**와 **Arduino Uno** 간 대역폭을 최적화한 실시간 양방향 시리얼 통신 시스템입니다.

###  Code Links
*  **Arduino Firmware:** [`led_control.ino`](./led_control.ino)
*  **p5.js Sketch:** [`sketch.js`](./sketch.js)
*  **Web Serial Helper:** [`serial-helper.js`](./serial-helper.js)

---

###  Bidirectional Data Flow
* **Web ➔ Arduino (제어 명령):** p5.js([`sketch.js`](./sketch.js)) 세로 슬라이더 입력 시 통신 과부하를 방지하기 위해 변화량이 5 이상이거나 경계값(0, 255)일 때만 `PWM:값\n` 문자열을 전송합니다. 아두이노([`led_control.ino`](./led_control.ino))는 10ms 주기(`TaskScheduler`)로 버퍼를 파싱하여 9번 핀 LED 밝기를 제어합니다.
* **Arduino ➔ Web (상태 피드백):** 아두이노의 시리얼 출력 메시지(`Serial.println`)를 [`serial-helper.js`](./serial-helper.js)의 비동기 스트림 파이프라인이 개행 문자(`\n`) 기준으로 분할/디코딩하여 웹 UI로 전달합니다.

###  Key Features
* **Delimiter Based Protocol:** 개행 문자(`\n`) 기반 패킷 분리로 데이터 쪼개짐 방지
* **Input Throttling:** 슬라이더 값 렌더링 조건을 통한 시리얼 대역폭 과부하 방지
* **Non-blocking I/O:** `setTimeout` 기반 비동기 수신 순환으로 p5.js 렌더링 프레임 유지
---

## 실습 영상 및 작동 시연



* **슬라이더 조작 시**: 슬라이더를 위아래로 움직이면 9번 핀에 연결된 LED의 밝기가 0에서 255까지 부드럽게 변화합니다.
