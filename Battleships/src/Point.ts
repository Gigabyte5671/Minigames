const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default class Point {
	public x;
	public y;

	constructor (x?: number | string, y?: number) {
		if (typeof x === 'string') {
			const thing = /(?<letter>[A-J])(?<number>(?:[0-9]|10))/i.exec(x);
			if (thing && thing.groups) {
				this.x = parseInt(thing.groups.number) - 1;
				this.y = letters.indexOf(thing.groups.letter.toUpperCase());
				return;
			}
			this.x = 0;
			this.y = 0;
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
		}
	}

	public get string (): string {
		return `${letters[this.y]}${this.x + 1}`;
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
