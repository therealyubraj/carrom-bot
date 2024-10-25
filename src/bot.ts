function bot(
  allCarromMen: CarromMan[],
  strikerRadius: number,
  baseLinePosition: { left: Vector2D; right: Vector2D },
  holes: Disc[],
  myMenColor: "white" | "black"
) {
  const striker = new Disc(
    Vector2D.add(baseLinePosition.left, new Vector2D(strikerRadius, 0)),
    strikerRadius
  );

  while (striker.position.x < baseLinePosition.right.x - strikerRadius) {
    const res = _bot(allCarromMen, striker, holes, myMenColor);

    if (res) {
      Vector2D.sub(res, striker.position).draw(
        striker.position,
        color(255, 255, 0)
      );
      fill(255, 0, 0);
      stroke(255);
      strokeWeight(4);
      striker.draw(color(255, 0, 0));
      circle(res.x, res.y, striker.radius * 2);
      return res;
    }

    striker.position.x += 5;
  }

  strokeWeight(4);
  stroke(0);
  line(0, 0, width, height);
  line(width, 0, 0, height);
  striker.draw(color(0, 0, 0, 0));
  return Vector2D.zero();
}

function _bot(
  allCarromMen: CarromMan[],
  striker: Disc,
  holes: Disc[],
  myMenColor: "white" | "black"
) {
  for (let i = 0; i < allCarromMen.length; i++) {
    const thisCarromMan = allCarromMen[i];

    if (thisCarromMan.color !== myMenColor) {
      continue;
    }

    const pocketableHoles = []; // which holes can this man be pocketed into

    for (let holeIndex = 0; holeIndex < holes.length; holeIndex++) {
      // if this man is in between the striker and the hole
      const thisHole = holes[holeIndex];
      if (
        isInBetween(
          thisCarromMan.position.x,
          thisHole.position.x,
          striker.position.x
        ) &&
        isInBetween(
          thisCarromMan.position.y,
          thisHole.position.y,
          striker.position.y
        ) &&
        Disc.canHitDirectly(allCarromMen, thisHole, thisCarromMan)
      ) {
        pocketableHoles.push(holes[holeIndex]);
      }
    }

    // can you hit the striker so that the man is pocketed into the hole
    for (let holeIndex = 0; holeIndex < pocketableHoles.length; holeIndex++) {
      const hole = pocketableHoles[holeIndex];

      const target = Disc.canHitDirectly(
        allCarromMen,
        thisCarromMan,
        striker,
        hole
      );

      if (target) {
        return target;
      }
    }
  }
}
