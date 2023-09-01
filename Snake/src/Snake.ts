import Apple from './Apple.js';
import Direction from './Direction.js';
import Point from './Point.js';
import State from './State.js';

export default class Snake {
	public cells = new Array<Point>();

	constructor () {
		this.cells.push(new Point(Math.floor(State.board.width / 2), Math.floor(State.board.height / 2)));
		this.cells.push(this.head.copy().add(Direction.Down.vector));
	}

	public get dead (): boolean {
		return Boolean(this.cells.find((cell, index) => index && this.head.equals(cell)));
	}

	public get head (): Point {
		return this.cells[0];
	}

	public get length (): number {
		return this.cells.length;
	}

	public update (): void {
		if (this.dead) {
			return;
		}
		let newPoint = this.head.copy().add(State.direction.vector);
		if (newPoint.x < 0) {
			newPoint.x = State.board.width - 1;
		} else if (newPoint.x > State.board.width - 1) {
			newPoint.x = 0;
		}
		if (newPoint.y < 0) {
			newPoint.y = State.board.height - 1;
		} else if (newPoint.y > State.board.height - 1) {
			newPoint.y = 0;
		}
		this.cells.unshift(newPoint);
		if (State.apple && this.head.equals(State.apple.point)) {
			State.apple = new Apple();
		} else {
			this.cells.pop();
		}
	}
}
