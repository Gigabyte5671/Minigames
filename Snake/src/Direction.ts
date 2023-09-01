import Point from './Point.js';

export default class Direction {
	public vector;

	constructor (vector: Point) {
		const x = vector.x / vector.x;
		const y = vector.y / vector.y;
		this.vector = new Point(isNaN(x) ? 0 : x, isNaN(y) ? 0 : y);
	}

	public static Up: Direction = { vector: new Point(0, -1) };
	public static Down: Direction = { vector: new Point(0, 1) };
	public static Left: Direction = { vector: new Point(-1, 0) };
	public static Right: Direction = { vector: new Point(1, 0) };
}
