class CarromBoard {
  blacks: Vector2D[];
  whites: Vector2D[];
  carromMenR: number;
  strikerR: number;
  holes: Vector2D[];
  holesR: number;

  constructor() {
    this.blacks = [
      new Vector2D(300, 300),
      //new Vector2D(400, 300)
      new Vector2D(400, 300),
    ];
    this.whites = [
      new Vector2D(300, 400),
      //new Vector2D(100, 500),
      //new Vector2D(400, 200),
      //new Vector2D(400, 400),
      //new Vector2D(200, 400),
    ];
    this.carromMenR = 20;

    this.holesR = this.carromMenR * 1.5;
    this.holes = [
      new Vector2D(this.holesR, this.holesR),
      new Vector2D(width - this.holesR, this.holesR),
      new Vector2D(width - this.holesR, height - this.holesR),
      new Vector2D(this.holesR, height - this.holesR),
    ];
    this.strikerR = this.carromMenR * 1.2;
  }

  draw() {
    const baseLine = {
      left: new Vector2D(100, 500),
      right: new Vector2D(500, 500),
    };

    bot(
      this.whites,
      this.blacks,
      this.carromMenR,
      this.strikerR,
      baseLine,
      this.holes,
      this.holesR,
      "black"
    );

    stroke(255);
    strokeWeight(1);

    fill(255);
    line(baseLine.left.x, baseLine.left.y, baseLine.right.x, baseLine.right.y);

    fill(0);
    for (const black of this.blacks) {
      circle(black.x, black.y, this.carromMenR * 2);
    }

    fill(255);
    for (const white of this.whites) {
      circle(white.x, white.y, this.carromMenR * 2);
    }

    fill(144);
    for (const hole of this.holes) {
      circle(hole.x, hole.y, this.holesR * 2);
    }
  }
}
