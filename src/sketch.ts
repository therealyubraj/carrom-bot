let carromBoard: CarromBoard;

function setup() {
  createCanvas(600, 600);

  frameRate(3);
  carromBoard = new CarromBoard();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(144, 200, 255);

  carromBoard.draw();
}
