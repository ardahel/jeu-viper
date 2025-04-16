export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D();
    return new Vector2D(this.x / mag, this.y / mag);
  }

  distance(vector) {
    return this.subtract(vector).magnitude();
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }
} 