# Arduino I2C LCD 커스텀 문자 애니메이션 구현

아두이노와 I2C 1602 LCD 모듈을 활용하여 사용자 정의 문자(Custom Character)를 등록하고, 이를 순차적으로 출력하여 위아래로 움직이는 애니메이션 효과를 구현한 프로젝트입니다.

## 1. 회로 연결

<img width="1068" height="554" alt="연결도" src="https://github.com/user-attachments/assets/8862099d-0721-4e3c-8656-d433f47fe39f" />

| LCD I2C Pin | Arduino Uno Pin | 비고 |
| :--- | :--- | :--- |
| **GND** | **GND** | 접지 |
| **VCC** | **5V** | 전원 공급 |
| **SDA** | **A4** | I2C 데이터 라인 |
| **SCL** | **A5** | I2C 클록 라인 |

- `LiquidCrystal_I2C` 라이브러리를 사용하며, I2C 통신을 위해 아두이노 우노의 A4(SDA), A5(SCL) 핀에 연결합니다.
  
## 2. 코드 설명

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// I2C 주소 0x27, 16열 2행 LCD 설정
LiquidCrystal_I2C lcd(0x27, 16, 2);

// 5x8 비트맵으로 정의한 7단계 커스텀 문자 배열
byte c[7][8] = {
  {0x1F, 0x0E, 0x04, 0x00, 0x00, 0x00, 0x00, 0x0A}, // 0번 패턴
  {0x0E, 0x04, 0x00, 0x00, 0x00, 0x00, 0x0A, 0x1F}, // 1번 패턴
  {0x04, 0x00, 0x00, 0x00, 0x00, 0x0A, 0x1F, 0x0E}, // 2번 패턴
  {0x00, 0x00, 0x00, 0x00, 0x0A, 0x1F, 0x0E, 0x04}, // 3번 패턴
  {0x00, 0x00, 0x00, 0x0A, 0x1F, 0x0E, 0x04, 0x00}, // 4번 패턴
  {0x00, 0x00, 0x0A, 0x1F, 0x0E, 0x04, 0x00, 0x00}, // 5번 패턴
  {0x00, 0x0A, 0x1F, 0x0E, 0x04, 0x00, 0x00, 0x00}  // 6번 패턴
};

void setup() {
  lcd.init();      // LCD 초기화
  lcd.backlight(); // 백라이트 켜기

  // HD44780 CGRAM에 0~6번 커스텀 문자 등록
  for (int i = 0; i < 7; i++) {
    lcd.createChar(i, c[i]);
  }
}

void loop() {
  // 0번부터 6번 문자를 0.3초 간격으로 순차 출력하여 애니메이션 연출
  for (int i = 0; i < 7; i++) {
    lcd.setCursor(0, 0); // (0, 0) 위치로 커서 이동
    lcd.write(i);        // 생성한 커스텀 문자 출력
    delay(300);          // 0.3s 대기
  }
}
```
## 3. 동작 영상 및 시연

https://github.com/user-attachments/assets/79d6f71e-e908-4eba-9843-ba9078da90ae
