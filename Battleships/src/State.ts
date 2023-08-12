import Board from './Board.js';
import Enemy from './Enemy.js';
import Event from './Event.js';
import Point from './Point.js';

const State = {
	cursor: new Point(),
	enemy: new Enemy(),
	enemyBoard: new Board(true, false),
	enemyReady: new Promise<void>((resolve) => resolve()),
	lastKeypress: <Buffer | undefined> undefined,
	moves: new Array<Event>(),
	placingShips: true,
	playerBoard: new Board(false, true),
	playerTurn: true,
	showHelp: false,
	turn: 1,
	victory: false
};

export default State;
