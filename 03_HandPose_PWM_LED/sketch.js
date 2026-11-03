let handPose, video, slider;
let hands = [];
let sliderValue = 50;
let connections;

// Web Serial 변수
let port;
let writer;
let connectBtn;
let lastPwmVal = -1;

async function setup() {
  createCanvas(640, 480);
  
  //========== Web Serial 연결 버튼 생성 ==========
  connectBtn = createButton('아두이노 연결');
  connectBtn.position(10, 470);
  connectBtn.mousePressed(connectSerial);
  
  slider = createSlider(0, 100, 50, 1);
  slider.style('writing-mode', 'vertical-rl');
  slider.style('height', '440px');
  slider.style('width', '20px');    
  slider.style('transform: rotate(180deg)'); 
  slider.position(10, 20);
  slider.input(updateSliderValue);
  
  video = createCapture(VIDEO, {flipped:true});
  video.size(640, 480);
  video.hide();
  
  handPose = await ml5.handPose({flipped:true});
  handPose.detectStart(video, gotHands);
  connections = handPose.getConnections();

  //===============================================
}

function draw() {
  image(video, 0, 0, width, height);

  drawSkeletons(hands);
  drawKeyPoints(hands);

  let adjustMode = isGrabMode(hands);
  if (adjustMode) {
    drawConnectedLine(hands);
    let c = slider.value();
    let v = getNormalizedDistance(hands);
    let nextVal = c + 0.05 * (v - c);
    slider.value(nextVal); // 부드럽게 조정
    sliderValue = nextVal;
  }

  // 슬라이더 값(0~100)을 PWM 값(0~255)으로 변환 후 전송
  sendPwmToArduino(sliderValue);
}

// 시리얼 포트 연결 함수
async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    writer = textEncoder.writable.getWriter();
    connectBtn.html('연결됨');
  } catch (e) {
    console.error("시리얼 연결 실패:", e);
  }
}

// 아두이노로 PWM 명령어 전송 ("PWM:val\n")
async function sendPwmToArduino(val) {
  if (!writer) return;

  // 0~100 범위 슬라이더 값을 0~255 범위로 변환
  let pwmVal = floor(map(val, 0, 100, 0, 255));
  pwmVal = constrain(pwmVal, 0, 255);

  // 대역폭 절약을 위해 값이 변했을 때만 전송
  if (pwmVal !== lastPwmVal) {
    lastPwmVal = pwmVal;
    await writer.write(`PWM:${pwmVal}\n`);
  }
}

function gotHands(results) {
  hands = results;
}

function drawKeyPoints(hs) {
  for (let i = 0; i < hs.length; i++) {
    let hand = hs[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(255, 0, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function drawSkeletons(hs) {
  for (let i = 0; i < hs.length; i++) {
    let hand = hs[i];
    stroke(0, 255, 0);
    strokeWeight(2);
    for (const [a, b] of connections) {
      const start = hand.keypoints[a];
      const end = hand.keypoints[b];
      if (start && end) {
        line(start.x, start.y, end.x, end.y);
      }
    }
  }  
}

function isGrabMode(hs) {
  if (hs == null || hs.length == 0) return false;
  let ks = hs[0].keypoints;
  if (ks.length != 21) return false;

  let palmLength   = dist(ks[0].x, ks[0].y, ks[9].x, ks[9].y);
  let grabDistance = dist(ks[0].x, ks[0].y, ks[12].x, ks[12].y);
  if (grabDistance > palmLength) return false;
  return true;
}

function drawConnectedLine(hs) {
  if (hs.length > 0) {
    let hand = hs[0];
    const a = hand.keypoints[4]; // 엄지 끝
    const b = hand.keypoints[8]; // 검지 끝
    stroke(255, 140, 0);
    strokeWeight(4);
    line(a.x, a.y, b.x, b.y);
    noFill();
    circle(a.x, a.y, 22);
    circle(b.x, b.y, 22);
  }
}

function getNormalizedDistance(hs) {
  if (hs.length > 0) {
    let ks = hs[0].keypoints;
    const a = ks[4]; // 엄지 끝
    const b = ks[8]; // 검지 끝
    const c = ks[0]; // 손목
    const d = ks[9]; // 중지 시작점
    let v = dist(a.x, a.y, b.x, b.y);
    let p = dist(c.x, c.y, d.x, d.y);
    let s = round(100 * (v / p)) - 15;
    return constrain(s, 0, 100);
  }
  return 0;
}

function updateSliderValue() {
  sliderValue = Number(slider.value());
}
