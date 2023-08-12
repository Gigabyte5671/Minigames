import Event from "./Event.js";
import Direction from "./Direction.js";
import Point from "./Point.js";
import State from "./State.js";

export default class Enemy {
	private events = new Array<Event>();
	private maxRetries = 100;
	public retries = 0;

	private wait (duration: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, duration));
	}

	private randomTarget (): Point {
		return new Point(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
	}

	private randomUnplayedTarget (): Point {
		let target = this.randomTarget();
		this.retries = 0;
		while (
			this.retries < this.maxRetries &&
			(State.playerBoard.cells.hit.find((cell) => target.equals(cell))
			|| State.playerBoard.cells.missed.find((cell) => target.equals(cell)))
		) {
			target = this.randomTarget();
			this.retries++;
		}
		return target;
	}

	private randomNearbyTarget (anchor: Point): Point {
		const target = anchor.copy();
		const directions = Object.values(Direction);
		let direction = directions[Math.floor(Math.random() * directions.length)];
		this.retries = 0;
		while (
			this.retries < this.maxRetries &&
			(
				target.x + direction.vector.x < 0
				|| target.x + direction.vector.x > 9
				|| target.y + direction.vector.y < 0
				|| target.y + direction.vector.y > 9
				|| State.playerBoard.cells.hit.find((cell) => target.copy().add(direction.vector).equals(cell))
				|| State.playerBoard.cells.missed.find((cell) => target.copy().add(direction.vector).equals(cell))
			)
		) {
			direction = directions[Math.floor(Math.random() * directions.length)];
			this.retries++;
		}
		target.add(direction.vector);
		return target;
	}

	public async move (): Promise<void> {
		await this.wait(250);
		let target;
		if (this.events.length > 0 && this.events[0].hit && !this.events[0].sunk) {
			target = this.randomNearbyTarget(this.events[0].position);
		} else {
			target = this.randomUnplayedTarget();
		}
		if (this.retries >= this.maxRetries) {
			target = this.randomUnplayedTarget();
		}
		State.playerBoard.fireAt(target);
		this.events.unshift(State.moves[0]);
	}
}
