class CarromBoard {
  blacks: Vector2D[];
  whites: Vector2D[];
  carromMenR: number;
  striker: Vector2D;
  strikerR: number;
  holes: Vector2D[];
  holesR: number;

  constructor() {
    this.blacks = [new Vector2D(300, 300)];
    this.whites = [
      new Vector2D(200, 200),
      new Vector2D(100, 500),
      new Vector2D(400, 200),
      new Vector2D(400, 400),
      new Vector2D(200, 400),
    ];
    this.carromMenR = 20;

    this.holesR = this.carromMenR * 1.5;
    this.holes = [
      new Vector2D(this.holesR, this.holesR),
      new Vector2D(width - this.holesR, this.holesR),
      new Vector2D(width - this.holesR, height - this.holesR),
      new Vector2D(this.holesR, height - this.holesR),
    ];
  }

  draw() {
    const { directlyPocketables: directlyPocketablesBlack } = bot(
      this.whites,
      this.blacks,
      this.carromMenR,
      this.striker,
      this.strikerR,
      { left: new Vector2D(0, 0), right: new Vector2D(0, 0) },
      this.holes,
      this.holesR,
      "black"
    );
    const { directlyPocketables: directlyPocketablesWhite } = bot(
      this.whites,
      this.blacks,
      this.carromMenR,
      this.striker,
      this.strikerR,
      { left: new Vector2D(0, 0), right: new Vector2D(0, 0) },
      this.holes,
      this.holesR,
      "white"
    );

    const directlyPocketables = [
      ...directlyPocketablesBlack,
      ...directlyPocketablesWhite,
    ];

    stroke(255);
    strokeWeight(1);

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

    fill(0, 255, 0);
    for (const pocketable of directlyPocketables) {
      circle(pocketable.x, pocketable.y, this.carromMenR);
    }
  }
}
