class Disc {
  static SERIAL_ID: number = 0;

  id: number;
  position: Vector2D;
  radius: number;

  constructor(position: Vector2D, radius: number) {
    this.position = new Vector2D(position.x, position.y);
    this.radius = radius;

    this.id = Disc.SERIAL_ID++;
  }

  /**
   * Can the `striker` hit the `toHit` towards the `target` without colliding with any of allDiscs.
   * NOTE: The `destination` is optional, if not provided, tests for center-to-center hit.
   */
  static canHitDirectly(
    allDiscs: Disc[],
    target: Disc,
    striker: Disc,
    destination?: Disc
  ) {
    let actualTarget: Disc = target;

    if (destination) {
      // calculate the point at which collision will occur.
      const hitDirectionVec = Vector2D.sub(
        destination.position,
        target.position
      );
      const collisionVec_target = Vector2D.scale(
        Vector2D.reverse(hitDirectionVec),
        target.radius + striker.radius
      );

      const actualTargetPosition = Vector2D.add(
        target.position,
        collisionVec_target
      );

      actualTarget = new Disc(actualTargetPosition, striker.radius);
    }

    const acutalTarget_striker = Vector2D.sub(
      actualTarget.position,
      striker.position
    );
    const acutalTarget_striker_normal = Vector2D.scale(
      Vector2D.normal(acutalTarget_striker),
      striker.radius
    );

    const rectTopLeft = Vector2D.sub(
      actualTarget.position,
      acutalTarget_striker_normal
    );

    const rectDims = new Vector2D(
      striker.radius * 2,
      acutalTarget_striker.mag()
    ); // use SqUaReD??

    const rectRotationAngle = atan2(
      acutalTarget_striker_normal.y,
      acutalTarget_striker_normal.x
    );

    // TO view the actual rect against which the collision is being checked.
    //push();
    //fill(0, 255, 0);
    //strokeWeight(1);
    //stroke(255);
    //translate(actualTarget.position.x, actualTarget.position.y);
    //rotate(rectRotationAngle);
    //rect(
    //Vector2D.sub(rectTopLeft, actualTarget.position).x,
    //Vector2D.sub(rectTopLeft, actualTarget.position).y,
    //rectDims.x,
    //rectDims.y
    //);
    //pop();
    //fill(255, 0, 0);
    //circle(actualTarget.position.x, actualTarget.position.y, 5);

    // given the actualTarget, can the striker get to the target without colliding with any of the discs.
    for (let i = 0; i < allDiscs.length; i++) {
      const otherDisc = allDiscs[i];

      if (otherDisc.id === striker.id || otherDisc.id === target.id) {
        continue;
      }

      if (
        checkRectCircleCollision(
          rectTopLeft,
          rectDims,
          rectRotationAngle,
          otherDisc
        )
      ) {
        // this direct contact is not possible
        return null;
      }
    }

    return actualTarget.position;
  }

  draw(colour: p5.Color = color(255)) {
    fill(colour);
    stroke(255);
    strokeWeight(1);
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}

class CarromMan extends Disc {
  color: "black" | "white";

  static RADIUS = 20;

  constructor(position: Vector2D, color: "black" | "white") {
    super(position, CarromMan.RADIUS);
    this.color = color;
  }

  draw() {
    super.draw(this.color === "black" ? color(0) : color(255));
  }
}
