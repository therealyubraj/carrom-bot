function bot(
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

  const directlyPocketables: Vector2D[] = [];
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
        const betweenCheck = isInBetween(otherMan, hole, man);
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
        }
      }
      if (isPottable) {
        pottableHoles.push(holeIndex);
      }
    }

    if (pottableHoles.length > 0) {
      // find the closest hole.
      let closestHoleIndex = pottableHoles[0];
      let closestDist = Vector2D.sub(
        holesPosition[closestHoleIndex],
        man
      ).magSq();

      for (
        let pottableHoleIndex = 1;
        pottableHoleIndex < pottableHoles.length;
        pottableHoleIndex++
      ) {
        const holeIndex = pottableHoles[pottableHoleIndex];
        const distVec = Vector2D.sub(holesPosition[holeIndex], man);
        const thisDist = distVec.magSq();

        if (thisDist < closestDist) {
          closestDist = distVec.magSq();
          closestHoleIndex = holeIndex;
        }
      }

      for (const holeIndex of pottableHoles) {
        Vector2D.sub(holesPosition[holeIndex], man).draw(
          man,
          color(255, 0, 0),
          20000
        );
      }

      Vector2D.sub(holesPosition[closestHoleIndex], man).draw(
        man,
        color(0, random(200, 255), random(0, 100)),
        20000
      );
      return true;
    }
    return false;
  }

  return { directlyPocketables };
}
