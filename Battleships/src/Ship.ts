import Direction from './Direction.js';
import Point from './Point.js';

export default class Ship {
	public position;
	public length;
	public direction;
	public name;
	public image = '______/``\\_|`\\___\n\\_________________|';
	public hits = new Set<Point>();

	constructor (name: string, position: Point, length: number, direction: Direction) {
		this.name = name;
		this.position = position;
		this.length = length;
		this.direction = direction;
	}

	public get cells (): Array<Point> {
		const cells = new Array<Point>();
		for (let i = -Math.ceil(this.length / 2) + 1; i < Math.ceil(this.length / 2 + 0.5); i++) {
			cells.push(new Point(this.position.x + i * this.direction.vector.x, this.position.y + i * this.direction.vector.y));
		}
		return cells;
	}

	public get sunk (): boolean {
		return this.hits.size >= this.length;
	}

	public includes (point: Point): boolean {
		return Boolean(this.cells.find((cell) => point.equals(cell)));
	}

	public hit (point: Point): void {
		const cell = this.cells.find((cell) => point.equals(cell));
		if (cell) {
			this.hits.add(cell);
		}
	}
}

export class Carrier extends Ship {
	constructor (position: Point, direction: Direction) {
		super('Carrier', position, 5, direction);
		this.image = '_______________|``\\__\n\\____________________/';
	}
}

export class Battleship extends Ship {
	constructor (position: Point, direction: Direction) {
		super('Battleship', position, 4, direction);
		this.image = '__\\_\\__/``\\_|`\\__/_\n\\__________________|';
	}
}

export class Cruiser extends Ship {
	constructor (position: Point, direction: Direction) {
		super('Cruiser', position, 3, direction);
	}
}

export class Submarine extends Ship {
	constructor (position: Point, direction: Direction) {
		super('Submarine', position, 3, direction);
		this.image = ' __|`\\___\n(_________>+';
	}
}

export class PatrolBoat extends Ship {
	constructor (position: Point, direction: Direction) {
		super('Patrol Boat', position, 2, direction);
		this.image = ' ___=_\n\\_____/';
	}
}

export class Buoy extends Ship {
	constructor (position: Point) {
		super('Buoy', position, 1, Direction.North);
		this.image = ' +\n |\n(_)';
	}
}
