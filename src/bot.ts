function bot(
  whites: Vector2D[],
  blacks: Vector2D[],
  carromMenR: number,
  strikerR: number,
  baseLinePosition: { left: Vector2D; right: Vector2D },
  holesPosition: Vector2D[],
  holesR: number,
  myMenColor: "white" | "black"
) {
  let strikerPosition = Vector2D.add(
    baseLinePosition.left,
    new Vector2D(strikerR, 0)
  );

  while (strikerPosition.x < baseLinePosition.right.x - strikerR) {
    const res = _bot(
      whites,
      blacks,
      carromMenR,
      strikerPosition,
      strikerR,
      baseLinePosition,
      holesPosition,
      holesR,
      myMenColor
    );

    if (res) {
      res.vec.draw(strikerPosition, color(255, 255, 0));
      fill(255, 0, 0);
      stroke(255);
      circle(strikerPosition.x, strikerPosition.y, strikerR * 2);
      return res.vec;
    }

    strikerPosition.x += 5;
  }

  stroke(255);
  fill(255, 0, 0);
  const randomVec = Vector2D.scale(
    new Vector2D(random(-1, 1), random(-1, 1)),
    random(10, 30)
  );

  randomVec.draw(Vector2D.zero(), color(0, 0, 0), 200000);
  return randomVec;
}
function _bot(
  whites: Vector2D[],
  blacks: Vector2D[],
  carromMenR: number,
  strikerPosition: Vector2D,
  strikerR: number,
  baseLinePosition: { left: Vector2D; right: Vector2D },
  holesPosition: Vector2D[],
  holesR: number,
  myMenColor: "white" | "black"
) {
  //: {
  //strikerPosition: number /** The x position of the striker in the baseline. */;
  //aimVector: Vector2D /** Since it's a vector, both position and magnitude are easily extracted from it.*/;
  //}
  const leftMostPossible = baseLinePosition.left.x + strikerR;
  const rightMostPossible = baseLinePosition.right.x - strikerR;

  const myMen = myMenColor === "white" ? whites : blacks;
  const otherMen = myMenColor === "white" ? blacks : whites;

  // Weird reason for doing this
  // so that we can tell while looping whether this man is that man or not. :)
  const allMen = [...myMen, ...otherMen];

  /**
   * From this striker position, find any men that can be shot into any pocket.
   * If found, aim towards that man and shoot with enough power(just simple distance to power equation should do).
   * If not found, move the striker a little bit to the other side and repeat.
   *
   * TODO: think about cases when no direct contact is possible.
   * */

  const directlyPocketables: { man: Vector2D; hole: Vector2D }[] = [];
  for (let manIndex = 0; manIndex < myMen.length; manIndex++) {
    const man = myMen[manIndex];
    // draw two lines from the man to the pocket
    let pottableHoles: number[] = [];
    for (let holeIndex = 0; holeIndex < holesPosition.length; holeIndex++) {
      const hole = holesPosition[holeIndex];
      // assume that the origin is at the man vector
      const directLine: Vector2D = new Vector2D(hole.x - man.x, hole.y - man.y);

      let isPottable = true;
      for (
        let otherManIndex = 0;
        otherManIndex < allMen.length;
        otherManIndex++
      ) {
        if (otherManIndex === manIndex) {
          continue;
        }

        // move the line up and down by carromMenR to get the bounding lines
        const otherMan = allMen[otherManIndex];
        const betweenCheck = isInBetween(otherMan, carromMenR, hole, man);
        const check1 = doesCircleIntersectLine(
          Vector2D.sub(otherMan, man),
          carromMenR * 2,
          directLine,
          carromMenR
        );
        const check2 = doesCircleIntersectLine(
          Vector2D.sub(otherMan, man),
          carromMenR * 2,
          directLine,
          -carromMenR
        );
        if (betweenCheck && (check1 || check2)) {
          isPottable = false;
          // break;
        }
      }
      if (isPottable) {
        pottableHoles.push(holeIndex);
      }
    }

    if (pottableHoles.length > 0) {
      // find the closest hole.
      let closestHoleIndex = -1;
      let closestDist = Infinity;
      for (
        let pottableHoleIndex = 0;
        pottableHoleIndex < pottableHoles.length;
        pottableHoleIndex++
      ) {
        if (
          !isInBetween(
            man,
            carromMenR,
            strikerPosition,
            holesPosition[pottableHoles[pottableHoleIndex]]
          )
        ) {
          continue;
        }
        const holeIndex = pottableHoles[pottableHoleIndex];
        const distVec = Vector2D.sub(holesPosition[holeIndex], man);
        const thisDist = distVec.magSq();

        if (thisDist < closestDist) {
          closestDist = distVec.magSq();
          closestHoleIndex = holeIndex;
        }
      }

      if (closestHoleIndex === -1) {
        continue;
      }

      Vector2D.sub(holesPosition[closestHoleIndex], man).draw(
        man,
        color(0, random(200, 255), random(0, 100)),
        20000
      );
      directlyPocketables.push({
        hole: holesPosition[closestHoleIndex],
        man,
      });
    }
  }

  const directlyStrikablePoints: Vector2D[] = [];
  for (
    let pocketableIndex = 0;
    pocketableIndex < directlyPocketables.length;
    pocketableIndex++
  ) {
    // can the striker directly reach the point which if struck the man travels towards the hole.
    const pocketable = directlyPocketables[pocketableIndex];

    // find the point which needs to be struck with relative to the man, which if struck the man will be pocketed.
    const toBeStruckPoint = Vector2D.scale(
      Vector2D.reverse(
        Vector2D.unit(
          new Vector2D(
            pocketable.hole.x - pocketable.man.x,
            pocketable.hole.y - pocketable.man.y
          )
        )
      ),
      strikerR + carromMenR
    );

    const relativeToStriker = Vector2D.add(
      new Vector2D(
        pocketable.man.x - strikerPosition.x,
        pocketable.man.y - strikerPosition.y
      ),
      toBeStruckPoint
    );

    // TODO: for y interecept use trigonometric functions: cos instead of jhelli approx
    // check if any other men will interfere with the line between striker and this point.
    let isStrikable = true;
    for (
      let otherManIndex = 0;
      otherManIndex < allMen.length;
      otherManIndex++
    ) {
      const otherMan = allMen[otherManIndex];

      if (otherMan.x === pocketable.man.x && otherMan.y === pocketable.man.y) {
        continue;
      }

      //const betweenCheck = isInBetween(
      //otherMan,
      //carromMenR,
      //Vector2D.add(toBeStruckPoint, pocketable.man),
      //strikerPosition
      //);
      const check1 = doesCircleIntersectLine(
        Vector2D.sub(otherMan, strikerPosition),
        strikerR * 2,
        relativeToStriker,
        strikerR
      );
      const check2 = doesCircleIntersectLine(
        Vector2D.sub(otherMan, strikerPosition),
        strikerR * 2,
        relativeToStriker,
        -strikerR
      );
      const check3 = doesCircleIntersectLine(
        Vector2D.sub(otherMan, strikerPosition),
        strikerR * 2,
        relativeToStriker,
        0
      );
      if (check1 || check2 || check3) {
        isStrikable = false;
        // break;
      }
    }

    if (isStrikable) {
      directlyStrikablePoints.push(relativeToStriker);
    }
  }

  if (directlyStrikablePoints.length > 0) {
    return {
      vec: directlyStrikablePoints[0],
    };
  }

  // we are doomed
  return null;
}
