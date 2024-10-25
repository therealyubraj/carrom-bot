function checkRectCircleCollision(
  rectTopLeft: Vector2D,
  rectDims: Vector2D,
  rotationAngle: number, // radians
  circle: Disc
) {
  const rotateDimsW = Vector2D.scale(
    new Vector2D(cos(rotationAngle), sin(rotationAngle)),
    rectDims.x
  );

  const rotateDimsH = Vector2D.scale(Vector2D.normal(rotateDimsW), rectDims.y);

  const rectCenter = Vector2D.add(
    rectTopLeft,
    Vector2D.add(
      Vector2D.scalarMult(rotateDimsW, 0.5),
      Vector2D.scalarMult(rotateDimsH, 0.5)
    )
  );

  const rectCenter_circle = Vector2D.sub(rectCenter, circle.position);
  // Calculate the angle between the rectangle's center vector and the x-axis
  const rectCenterAngle = Math.atan2(rectCenter_circle.y, rectCenter_circle.x);

  // Project the circle's center onto the rectangle's axes
  const distAlongRectX =
    rectCenter_circle.mag() * Math.cos(rectCenterAngle - rotationAngle);
  const distAlongRectY =
    rectCenter_circle.mag() * Math.sin(rectCenterAngle - rotationAngle);

  // Check if the projection falls within the rectangle's bounds
  return (
    Math.abs(distAlongRectX) <= rotateDimsW.mag() / 2 + circle.radius &&
    Math.abs(distAlongRectY) <= rotateDimsH.mag() / 2 + circle.radius
  );
}

function isCircleInsideRect(
  rectTopLeft: Vector2D,
  rectDims: Vector2D,
  circle: Disc
) {
  const rectBottomRight = Vector2D.add(rectTopLeft, rectDims);
  if (
    rectTopLeft.x < circle.position.x - circle.radius &&
    rectTopLeft.y < circle.position.y - circle.radius &&
    rectBottomRight.x > circle.position.x + circle.radius &&
    rectBottomRight.y > circle.position.y + circle.radius
  ) {
    return true;
  }
  return false;
}

function radiansToDegree(radians: number) {
  return (180 * radians) / Math.PI;
}

function degreeToRadians(degree: number) {
  return (Math.PI * degree) / 180;
}

function isInBetween(val: number, thres1: number, thres2: number) {
  return (thres1 < val && val < thres2) || (thres2 < val && val < thres1);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
