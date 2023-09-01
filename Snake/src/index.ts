import Apple from './Apple.js';
import Direction from './Direction.js';
import Point from './Point.js';
import Snake from './Snake.js';
import State from './State.js';

function render (): void {
	console.clear();

	let output = '';
	const width = State.board.width + 1;
	const height = State.board.height + 1;
	for (let y = -1; y < height; y++) {
		for (let x = -1; x < width; x++) {
			if (y < 0 && x < 0) {
				output += '┌─';
			}
			else if (y < 0 && x >= width - 1) {
				output += '─┐';
			}
			else if (y >= height - 1 && x < 0) {
				output += '└─';
			}
			else if (y >= height - 1 && x >= width - 1) {
				output += '─┘';
			}
			else if (x < 0) {
				output += '│ ';
			}
			else if (x >= width - 1) {
				output += ' │';
			}
			else if (y < 0 || y >= height - 1) {
				output += '──';
			}
			else if (State.snake?.head.equals(new Point(x, y))) {
				output += (State.snake.dead ? '\x1b[31m' : '\x1b[32m') + '██\x1b[0m';
			}
			else if (State.snake?.cells.find((cell) => cell.equals(new Point(x, y)))) {
				output += (State.snake.dead ? '\x1b[31m' : '\x1b[32m') + '\x1b[2m██\x1b[0m';
			}
			else if (State.apple?.point.equals(new Point(x, y))) {
				output += '🍎';
			}
			else {
				output += '  ';
			}
		}
		output += '\n';
	}

	console.log(output);
	console.log('Score:', typeof State.snake?.length === 'number' ? State.snake.length - 2 : 0);
	console.log('\n');

	if (State.snake?.dead) {
		process.exit();
	}
}

async function main (): Promise<void> {
	setInterval(render, 50);

	State.apple = new Apple();
	State.snake = new Snake();
	setInterval(State.snake.update.bind(State.snake), 250);

	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', async (key) => {
		if (key.toString() === '\u0003') { process.exit(); } // Ctrl-C

		if (key.toString() === '\u001B\u005B\u0041' && !State.direction.vector.equals(Direction.Down.vector)) { // Up
			State.direction = Direction.Up;
		}
		if (key.toString() === '\u001B\u005B\u0043' && !State.direction.vector.equals(Direction.Left.vector)) { // Right
			State.direction = Direction.Right;
		}
		if (key.toString() === '\u001B\u005B\u0042' && !State.direction.vector.equals(Direction.Up.vector)) { // Down
			State.direction = Direction.Down;
		}
		if (key.toString() === '\u001B\u005B\u0044' && !State.direction.vector.equals(Direction.Right.vector)) { // Left
			State.direction = Direction.Left;
		}
	});
}

main();
