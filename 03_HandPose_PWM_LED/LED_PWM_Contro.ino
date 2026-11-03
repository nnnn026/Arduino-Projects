// =====================================
// 1. Pin Settings
// =====================================
const uint8_t LED2_PIN = 11; // PWM 제어용 LED

// =====================================
// 2. Buffer & Variable Settings
// =====================================
char command[16];
uint8_t index = 0;

// =====================================
// 3. Setup
// =====================================
void setup() {
  Serial.begin(9600);
  pinMode(LED2_PIN, OUTPUT);
  analogWrite(LED2_PIN, 0); // 초기 밝기 OFF

  Serial.println("System Ready - PWM Control Only");
}

// =====================================
// 4. Main Loop
// =====================================
void loop() {
  while (Serial.available() > 0) {
    char c = Serial.read();

    if (c == '\n' || c == '\r') {
      if (index > 0) {
        command[index] = '\0'; // 문자열 종단

        // PWM:0 ~ PWM:255 
        if (strncmp(command, "PWM:", 4) == 0) {
          int pwmVal = atoi(&command[4]);
          pwmVal = constrain(pwmVal, 0, 255);
          analogWrite(LED2_PIN, pwmVal);
        }
        index = 0; // 초기화
      }
    } else {
      if (index < sizeof(command) - 1) {
        command[index++] = c;
      } else {
        index = 0; // 초기화
      }
    }
  }
}