class CarromBoard {
  allCarromMen: CarromMan[] = [];
  holes: Disc[] = [];

  constructor() {
    this.allCarromMen.push(
      new CarromMan(
        Vector2D.random(150, 450),
        Math.random() < 0.5 ? "black" : "white"
      ),
      new CarromMan(
        Vector2D.random(150, 450),
        Math.random() < 0.5 ? "black" : "white"
      ),
      new CarromMan(
        Vector2D.random(150, 450),
        Math.random() < 0.5 ? "black" : "white"
      ),
      new CarromMan(
        Vector2D.random(150, 450),
        Math.random() < 0.5 ? "black" : "white"
      )
      //      new CarromMan(new Vector2D(500, 100), "black")
    );

    const holeRadius = 20 * 1.75;
    this.holes.push(
      new Disc(new Vector2D(holeRadius, holeRadius), holeRadius),
      new Disc(new Vector2D(width - holeRadius, holeRadius), holeRadius),
      new Disc(
        new Vector2D(width - holeRadius, height - holeRadius),
        holeRadius
      ),
      new Disc(new Vector2D(holeRadius, height - holeRadius), holeRadius)
    );
  }

  draw() {
    const baseLine = {
      left: new Vector2D(100, 500),
      right: new Vector2D(500, 500),
    };

    for (const hole of this.holes) {
      hole.draw(color(155));
    }

    for (const man of this.allCarromMen) {
      man.draw();
    }

    stroke(255);
    strokeWeight(1);
    fill(255);
    line(baseLine.left.x, baseLine.left.y, baseLine.right.x, baseLine.right.y);

    bot(
      this.allCarromMen,
      CarromMan.RADIUS * 1.25,
      baseLine,
      this.holes,
      "white"
    );
  }
}
