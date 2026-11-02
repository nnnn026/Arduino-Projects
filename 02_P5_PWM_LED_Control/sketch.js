// 복잡한 통신은 serial-helper.js가 처리합니다.
let serial, connectButton;
let statusText = 'Arduino를 연결해 주세요.';
let ledSlider;
let lastSentPwm = 0;

function setup() {
  createCanvas(400, 350);
  textFont('sans-serif');
  
  serial = new SerialHelper(9600, receiveLine, message => statusText = message);
  connectButton = createButton('Arduino 연결 / 해제');
  connectButton.position(100, 300);
  connectButton.mousePressed(() => serial.toggle());

  // 세로 LED 슬라이더
  ledSlider = createSlider(0, 255, 0); 
  ledSlider.style('transform', 'rotate(-90deg)');
  ledSlider.style('width', '180px');
  ledSlider.position(110, 170);

  ledSlider.input(() => {
    const currentPwm = ledSlider.value();
    
    if (Math.abs(currentPwm - lastSentPwm) >= 5 || currentPwm === 0 || currentPwm === 255) {
      serial.send(`PWM:${currentPwm}`);
      lastSentPwm = currentPwm;
    }
  });
}

function draw() {
  background(242, 246, 250);
  fill(25, 40, 60); noStroke(); textAlign(CENTER);
  
  textSize(20); text('Arduino PWM LED Control', width / 2, 40);
  textSize(12); text(statusText, 320, 320);

  const pwmVal = ledSlider.value();
  textSize(16); text('9번 핀 LED 밝기', width / 2 -10 , 65);
  
  fill('#3b82f6');
  text(pwmVal, width / 2 + 50, 160);
  
  textSize(14); 
  fill(100);
  text('/ 255', width / 2 + 50, 180);
  textSize(12);
  text('슬라이더를 조작하여 LED 밝기를 제어하세요.', 200, 280);
}

function receiveLine(line) {
  
}
