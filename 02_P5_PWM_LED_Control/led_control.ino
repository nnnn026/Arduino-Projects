#include <TaskScheduler.h>

// =====================================
// 1. Pin Settings
// =====================================
const uint8_t LED2_PIN = 9; // PWM 제어용 LED

// =====================================
// 2. Function Declarations
// =====================================
void taskSerialCallback();

// =====================================
// 3. TaskScheduler
// =====================================
Scheduler runner;

// Serial command processing: 10 ms (빠른 슬라이더 반응을 위해 주기 단축)
Task tSerial(
  10, TASK_FOREVER,
  &taskSerialCallback, &runner, true
);

// =====================================
// 4. Task: Serial Communication
// =====================================
void taskSerialCallback() {
  static char command[16];
  static uint8_t index = 0;
  static bool overflow = false;

  while (Serial.available() > 0) {
    char c = Serial.read();

    if (c == '\n' || c == '\r') {
      if (overflow) {
        Serial.println("Command too long");
      }
      else if (index > 0) {
        command[index] = '\0';

        // PWM:0 ~ PWM:255 명령어 파싱
        if (strncmp(command, "PWM:", 4) == 0) {
          int pwmVal = atoi(&command[4]);
          pwmVal = constrain(pwmVal, 0, 255);
          analogWrite(LED2_PIN, pwmVal);
        }
      }

      index = 0;
      overflow = false;
    }
    else if (!overflow) {
      // 알파벳 소문자 대문자 변환
      if (c >= 'a' && c <= 'z') {
        c = c - 'a' + 'A';
      }

      if (index < sizeof(command) - 1) {
        command[index++] = c;
      }
      else {
        index = 0;
        overflow = true;
      }
    }
  }
}

// =====================================
// 5. Setup
// =====================================
void setup() {
  Serial.begin(9600);

  pinMode(LED2_PIN, OUTPUT);
  analogWrite(LED2_PIN, 0); // 초기 밝기 OFF

  Serial.println("System Ready - PWM Control Only");
}

// =====================================
// 6. Main Loop
// =====================================
void loop() {
  runner.execute();
}