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

## 스케치 

---

## 실습 영상 및 작동 시연



* **슬라이더 조작 시**: 슬라이더를 위아래로 움직이면 9번 핀에 연결된 LED의 밝기가 0에서 255까지 부드럽게 변화합니다.
