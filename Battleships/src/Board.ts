import Direction from './Direction.js';
import Event from './Event.js';
import Point from './Point.js';
import type Ship from './Ship.js';
import { Carrier, Battleship, Cruiser, Submarine, PatrolBoat, Buoy } from './Ship.js';
import State from './State.js';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default class Board {
	public showCursor;
	public showFleet;
	public shipsToArrange = new Array<Ship>(new Carrier(new Point(), Direction.North), new Battleship(new Point(), Direction.North), new Cruiser(new Point(), Direction.North), new Submarine(new Point(), Direction.North), new PatrolBoat(new Point(), Direction.North), new Buoy(new Point()));
	public arrangedShips = new Array<Ship>();
	public selectedShip?: Ship;
	public cells = {
		occupied: new Array<Point>(),
		missed: new Array<Point>(),
		hit: new Array<Point>()
	}

	constructor (showCursor = true, showFleet = true) {
		this.showCursor = showCursor;
		this.showFleet = showFleet;
	}

	public get string (): string {
		let output = ' ';
		for (let x = 0; x < 10; x++) {
			output += ` ${this.showCursor && State.playerTurn && State.cursor.x === x ? '\x1b[0m' : '\x1b[2m'}${x + 1}\x1b[0m`;
		}
		output += '\n';
		const scan = new Point();
		for (scan.y = 0; scan.y < 10; scan.y++) {
			output += `${this.showCursor && State.playerTurn && State.cursor.y === scan.y ? '\x1b[0m' : '\x1b[2m'}${letters[scan.y]}\x1b[0m`;
			for (scan.x = 0; scan.x < 10; scan.x++) {
				if (this.showCursor && State.playerTurn && !State.placingShips && State.cursor.equals(scan)) {
					if (this.cells.hit.find((cell) => State.cursor.equals(cell))) {
						output += ' \x1b[31m+\x1b[0m';
					} else if (this.cells.missed.find((cell) => State.cursor.equals(cell))) {
						output += ' \x1b[36m+\x1b[0m';
					} else {
						output += ' +';
					}
				} else if (this.selectedShip?.includes(scan)) {
					const collision = this.colliding(this.selectedShip) || this.outOfBounds(this.selectedShip);
					output += ` ${collision ? '\x1b[31m' : '\x1b[32m'}#\x1b[0m`;
				}  else if (this.cells.hit.find((cell) => scan.equals(cell))) {
					output += ' \x1b[31m⨯\x1b[0m';
				} else if (this.showFleet && this.cells.occupied.find((cell) => scan.equals(cell))) {
					output += ' #';
				} else if (this.cells.missed.find((cell) => scan.equals(cell))) {
					output += ' \x1b[36m•\x1b[0m';
				} else {
					output += ' \x1b[90m~\x1b[0m';
				}
			}
			output += scan.y < 9 ? '\n' : '';
		}
		return output;
	}

	private colliding (ship: Ship): boolean {
		return Boolean(this.cells.occupied.find((cell) => ship.includes(cell)));
	}

	private outOfBounds (ship: Ship): boolean {
		return Boolean(ship.cells.find((cell) => cell.x < 0 || cell.x > 9 || cell.y < 0 || cell.y > 9));
	}

	public selectShip (index: number): void {
		this.shipsToArrange[index].position = State.cursor;
		this.selectedShip = this.shipsToArrange[index];
	}

	public placeShip (index: number, position: Point): void {
		if (this.colliding(this.shipsToArrange[index]) || this.outOfBounds(this.shipsToArrange[index])) {
			return;
		}
		this.arrangedShips.unshift(this.shipsToArrange.splice(index, 1)[0]);
		this.arrangedShips[0].position = position.copy();
		this.cells.occupied.push(...this.arrangedShips[0].cells);
	}

	public randomBuoys (amount: number): void {
		for (let i = 0; i < Math.min(amount, 100); i++) {
			let position = new Point(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9));
			while (this.cells.occupied.find((cell) => position.equals(cell))) {
				position = new Point(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9));
			}
			const buoy = new Buoy(position);
			this.arrangedShips.push(buoy);
			this.cells.occupied.push(...buoy.cells);
		}
	}

	public async randomShips (): Promise<void> {
		while (this.shipsToArrange.length > 0) {
			const ship = this.shipsToArrange[0];
			ship.direction = Direction.random();
			ship.position = new Point(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9));
			while (this.colliding(ship) || this.outOfBounds(ship)) {
				ship.direction = Direction.random();
				ship.position = new Point(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9));
			}
			this.placeShip(0, ship.position);
		}
	}

	public fireAt (target: Point): void {
		const hit = this.cells.occupied.find((cell) => target.equals(cell));
		if (hit) {
			this.cells.occupied.splice(this.cells.occupied.indexOf(hit), 1);
			this.cells.hit.push(target.copy());
			const hitShip = this.arrangedShips.find((ship) => ship.includes(hit));
			const sunk = !hitShip?.cells.map((cell) => Boolean(this.cells.hit.find((cell2) => cell.equals(cell2))))?.includes(false);
			State.moves.unshift(new Event(State.playerTurn, target.copy(), true, sunk ? hitShip : undefined));
		} else {
			this.cells.missed.push(target.copy());
			State.moves.unshift(new Event(State.playerTurn, target.copy(), false));
		}
	}
}
