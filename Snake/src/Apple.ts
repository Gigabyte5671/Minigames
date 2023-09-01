import Point from "./Point.js";
import State from "./State.js";

export default class Apple {
	public point;

	constructor () {
		let point = new Point(
			Math.floor(Math.random() * State.board.width),
			Math.floor(Math.random() * State.board.height)
		);

		while (State.snake?.cells.find((cell) => point.equals(cell))) {
			point = new Point(
				Math.floor(Math.random() * State.board.width),
				Math.floor(Math.random() * State.board.height)
			);
		}

		this.point = point;
	}
}
