import type Point from "./Point.js";
import type Ship from "./Ship.js";

export default class Event {
	public player;
	public position;
	public hit;
	public sunk;

	constructor (player: boolean, position: Point, hit: boolean, sunk?: Ship) {
		this.player = player;
		this.position = position;
		this.hit = hit;
		this.sunk = sunk;
	}

	public get string (): string {
		let output = `${this.player ? '\x1b[32mYou' : '\x1b[31mEnemy'}\x1b[90m: `;
		output += `\x1b[37m${this.position.string}\x1b[90m, `;
		output += `${this.sunk ? `\x1b[31mSunk ${this.player ? 'the enemy\'s' : 'your'} ${this.sunk.name}!` : this.hit ? '\x1b[31mHit!' : '\x1b[36mMiss'}\x1b[0m`;
		return output;
	}
}
