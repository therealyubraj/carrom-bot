class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  magSq() {
    return this.x ** 2 + this.y ** 2;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  toString() {
    return JSON.stringify(this);
  }

  draw(origin: Vector2D, col: p5.Color, scale?: number) {
    strokeWeight(4);
    stroke(col);
    if (!scale) {
      scale = this.mag();
    }
    const scaled = Vector2D.scale(this, scale);
    const lineVec = Vector2D.add(scaled, origin);
    line(origin.x, origin.y, lineVec.x, lineVec.y);
  }

  static zero() {
    return new Vector2D(0, 0);
  }

  static reverse(vec: Vector2D) {
    return new Vector2D(-vec.x, -vec.y);
  }

  static abs(vec: Vector2D) {
    return new Vector2D(Math.abs(vec.x), Math.abs(vec.y));
  }

  static normal(vec: Vector2D) {
    return new Vector2D(-vec.y, vec.x);
  }

  static add(vec1: Vector2D, vec2: Vector2D) {
    return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  static sub(vec1: Vector2D, vec2: Vector2D) {
    return Vector2D.add(vec1, Vector2D.reverse(vec2));
  }

  static dot(vec1: Vector2D, vec2: Vector2D) {
    return new Vector2D(vec1.x * vec2.x, vec1.y * vec2.y);
  }

  static scalarMult(vec1: Vector2D, factor: number) {
    return new Vector2D(vec1.x * factor, vec1.y * factor);
  }

  static unit(vec: Vector2D) {
    const mag = vec.mag();
    if (mag === 0) {
      return Vector2D.zero();
    }
    return new Vector2D(vec.x / mag, vec.y / mag);
  }

  static scale(vec: Vector2D, factor: number) {
    const unitVec = Vector2D.unit(vec);
    return new Vector2D(unitVec.x * factor, unitVec.y * factor);
  }

  static clamp(vec: Vector2D, mag: number) {
    if (vec.mag() >= mag) {
      return Vector2D.scale(vec, mag);
    }

    return vec;
  }

  static random(min: number, max: number) {
    return new Vector2D(randomInRange(min, max), randomInRange(min, max));
  }
}
