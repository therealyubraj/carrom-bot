function isInBetween(
  vec: Vector2D,
  boundingVec1: Vector2D,
  boundingVec2: Vector2D
) {
  if (vec.x > boundingVec1.x && vec.x > boundingVec2.x) {
    return false;
  }
  if (vec.y > boundingVec1.y && vec.y > boundingVec2.y) {
    return false;
  }
  if (vec.x < boundingVec1.x && vec.x < boundingVec2.x) {
    return false;
  }
  if (vec.y < boundingVec1.y && vec.y < boundingVec2.y) {
    return false;
  }

  return true;
}

function doesCircleIntersectLine(
  circlePos: Vector2D,
  circleR: number,
  line: Vector2D,
  yIntercept: number
) {
  if (line.x === 0) {
    line.x = 0.0001;
  }

  const slope = line.y / line.x;

  const a = -slope;
  const b = 1;
  const c = -yIntercept;
  const perpDist =
    (a * circlePos.x + b * circlePos.y + c) ** 2 / (a ** 2 + b ** 2);

  if (perpDist < circleR ** 2) {
    return true;
  }

  return false;
}
