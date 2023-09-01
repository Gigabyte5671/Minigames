import type Apple from './Apple.js';
import Direction from './Direction.js';
import type Snake from './Snake.js';

const State = {
	apple: undefined as Apple | undefined,
	board: {
		width: 12,
		height: 12
	},
	direction: Direction.Up,
	snake: undefined as Snake | undefined
};

export default State;
