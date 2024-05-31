let Background;
let Tower;
let lines = [];
let backgroundGraphics;
let towerGraphics;
let maxLines = 1000;

class Line {
  constructor(x1, y1, x2, y2, color, thickness, direction, speed) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.thickness = thickness;
    this.direction = direction;
    this.speed = speed;
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.thickness);
    line(this.x1, this.y1, this.x2, this.y2);
  }

  update() {
    let angle = atan2(this.y2 - this.y1, this.x2 - this.x1);
    this.x1 += this.direction * this.speed * cos(angle);
    this.x2 += this.direction * this.speed * cos(angle);
    this.y1 += this.direction * this.speed * sin(angle);
    this.y2 += this.direction * this.speed * sin(angle);
  }
}

function preload() {
  Background = loadImage('asset/originalWork.jpg');
  Tower = loadImage('asset/tower.png');
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  Tower.resize(windowWidth, windowHeight);
  backgroundGraphics = drawBackground(Background);
  towerGraphics = drawBackground(Tower);
  redraw();
}

function draw() {
  image(backgroundGraphics, 0, 0, windowWidth, windowHeight);
  tint(255, 5);

  for (let i = 0; i < 30; i++) {
    addLine(Background);
  }

  image(towerGraphics, 0, 0, windowWidth, windowHeight);
  tint(255, 10);

  for (let i = 0; i < 15; i++) {
    addLine(Tower);
  }

  while (lines.length > maxLines) {
    lines.shift();
  }

  for (let line of lines) {
    line.update();
    line.draw();
  }
}

function createLine(img, x1 = null, y1 = null, speed =1.5) {
  if (x1 === null) x1 = random(windowWidth);
  if (y1 === null) y1 = random(windowHeight);

  const { angle, length, direction } = getLineProperties(img, y1);
  const x2 = x1 + cos(angle) * length;
  const y2 = y1 + sin(angle) * length;
  const color = img.get(x1, y1);
  const thickness = random(3, 10);

  return new Line(x1, y1, x2, y2, color, thickness, direction, speed);
}

function getLineProperties(img, y1) {
  let angle;
  let direction = 1;

  if (img === Tower) {
    angle = PI / 2 + random(-PI / 5, PI / 5);
    direction = -1;
  } else {
    if (y1 > windowHeight * 0.3 && y1 < windowHeight * 0.6) {
      direction = -1;
    }
    if (y1 < windowHeight * 0.6) {
      angle = PI / 2 + random(-PI / 5, PI / 5);
    } else {
      angle = random(PI * 0.85, PI * 1.05);
    }
  }

  const length = random(50);
  return { angle, length, direction };
}

function drawBackground(img) {
  img.resize(windowWidth, windowHeight);
  let graphics = createGraphics(windowWidth, windowHeight);
  graphics.clear();

  const numLines = 50000;
  for (let i = 0; i < numLines; i++) {
    const line = createLine(img);
    graphics.stroke(line.color);
    graphics.strokeWeight(line.thickness);
    graphics.line(line.x1, line.y1, line.x2, line.y2);
  }

  return graphics;
}

function addLine(img) {
  const line = createLine(img);
  lines.push(line);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateBackground();
  redraw();
}
