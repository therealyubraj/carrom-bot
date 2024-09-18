let board: CarromBoard;
function setup() {
  createCanvas(600, 600);

  frameRate(5);

  board = new CarromBoard();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(144, 200, 255);

  board.draw();
}
