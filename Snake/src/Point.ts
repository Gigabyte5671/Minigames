export default class Point {
	public x;
	public y;

	constructor (x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public add (position: Point): Point {
		this.x += position.x;
		this.y += position.y;
		return this;
	}

	public copy (): Point {
		return new Point(this.x, this.y);
	}

	public equals (position: Point): boolean {
		return position.x === this.x && position.y === this.y;
	}
}
