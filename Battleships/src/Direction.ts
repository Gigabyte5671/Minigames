import Point from './Point.js';

export default class Direction {
	public vector;

	constructor (vector: Point) {
		this.vector = vector;
	}

	public static North: Direction = { vector: new Point(0, -1) };
	public static South: Direction = { vector: new Point(0, 1) };
	public static East: Direction = { vector: new Point(1, 0) };
	public static West: Direction = { vector: new Point(-1, 0) };

	public static next (previous: Direction): Direction {
		if (previous.vector.equals(this.North.vector)) {
			return Direction.East;
		} else if (previous.vector.equals(this.East.vector)) {
			return Direction.South;
		} else if (previous.vector.equals(this.South.vector)) {
			return Direction.West;
		} else {
			return Direction.North;
		}
	}

	public static random (): Direction {
		const index = Math.floor(Math.random() * 4);
		switch (index) {
			case 0:
				return this.North;
			case 1:
				return this.South;
			case 2:
				return this.East;
			case 3:
				return this.West;
			default:
				return this.North;
		}
	}
}
