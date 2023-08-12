import Direction from './Direction.js';
import IO from './IO.js';
import State from './State.js';

const logo = `
    ____        __  __  __          __    _           
   / __ )____ _/ /_/ /_/ /__  _____/ /_  (_)___  _____
  / __  / __ \`/ __/ __/ / _ \\/ ___/ __ \\/ / __ \\/ ___/
 / /_/ / /_/ / /_/ /_/ /  __(__  ) / / / / /_/ (__  ) 
/_____/\\__,_/\\__/\\__/_/\\___/____/_/ /_/_/ .___/____/  
                                       /_/
`;

function render (): void {
	IO.clear();
	IO.out(logo);

	if (State.showHelp) {
		IO.out('Controls while arranging fleet:');
		IO.out('  Move (Arrows)');
		IO.out('  Rotate (R)');
		IO.out('  Place ship (Space)');
		IO.out('\n');
		IO.out('Controls while in battle:');
		IO.out('  Move (Arrows)');
		IO.out('  Fire (Space)');
		IO.out('\n');
		IO.out('Exit game (Ctrl+C)');

		IO.out('\n');
		return;
	}

	if (State.victory) {
		IO.out(`                     ${State.playerTurn ? ' \x1b[42m You' : '\x1b[41m Enemy'} won! \x1b[0m`);
		IO.out(`                       \x1b[2mTurn ${State.turn}\x1b[0m\n\n`);
	} else if (State.placingShips) {
		IO.out(`                  ${State.playerBoard.selectedShip ? 'Arrange your fleet' : '     Loading...'}\n\n\n`);
	} else {
		IO.out(`                    ${State.playerTurn ? '  Your' : 'Enemy\'s'} turn`);
		IO.out(`                       \x1b[2mTurn ${State.turn.toString().padStart(2, ' ')}\x1b[0m\n\n`);
	}

	const enemyBoardString = State.enemyBoard.string.split('\n');
	const playerBoardString = State.playerBoard.string.split('\n');
	let doubleBoardString = '';
	for (let i = 0; i < playerBoardString.length; i++) {
		doubleBoardString += '   ' + enemyBoardString[i] + '   ' + (i ? ' ' : '') + playerBoardString[i] + '\n';
	}
	
	IO.out(doubleBoardString, '\x1b[2m        Enemy waters             Your fleet\x1b[0m');
	IO.out('\n');

	const maxMoves = Math.min(4, State.moves.length);
	for (let i = maxMoves - 1; i >= 0; i--) {
		IO.out(`   ${i ? '\x1b[2m' : ''}${State.moves[i].string}`);
	}

	IO.out('\n');
}

function checkForWin (): void {
	if (State.enemyBoard.cells.occupied.length <= 0 || State.playerBoard.cells.occupied.length <= 0) {
		State.victory = true;
		render();
		process.exit();
	}
}

async function main (): Promise<void> {
	setInterval(render, 50);

	State.enemyBoard.showCursor = false;
	State.playerBoard.showCursor = true;
	State.playerBoard.selectShip(0);

	State.enemyReady = State.enemyBoard.randomShips();

	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', async (key) => {
		State.lastKeypress = key;

		if (key.toString() === '\u002F' || key.toString() === '\u003F') { State.showHelp = !State.showHelp; } // Question mark
		if (key.toString() === '\u001B') { State.showHelp = false; } // Esc
		if (key.toString() === '\u0003') { process.exit(); } // Ctrl-C

		if (State.showHelp) { return; }

		if (key.toString() === '\u001B\u005B\u0041') { // Up
			State.cursor.y = Math.max(State.cursor.y - 1, 0);
		}
		if (key.toString() === '\u001B\u005B\u0043') { // Right
			State.cursor.x = Math.min(State.cursor.x + 1, 9);
		}
		if (key.toString() === '\u001B\u005B\u0042') { // Down
			State.cursor.y = Math.min(State.cursor.y + 1, 9);
		}
		if (key.toString() === '\u001B\u005B\u0044') { // Left
			State.cursor.x = Math.max(State.cursor.x - 1, 0);
		}

		if (key.toString() === '\u0072' && State.placingShips) { // R
			const ship = State.playerBoard.selectedShip;
			if (ship) {
				ship.direction = Direction.next(ship.direction);
			}
		}

		if (key.toString() === '\u0020' && State.playerTurn) { // Space
			if (State.placingShips) {
				State.playerBoard.placeShip(0, State.cursor);
				if (State.playerBoard.shipsToArrange.length > 0) {
					State.playerBoard.selectShip(0);
				} else {
					State.playerBoard.selectedShip = undefined;
					State.playerBoard.showCursor = false;
					await State.enemyReady;
					State.placingShips = false;
					State.enemyBoard.showCursor = true;
				}
			} else {
				State.enemyBoard.fireAt(State.cursor);
				checkForWin();
				State.playerTurn = false;
				await State.enemy.move();
				checkForWin();
				State.playerTurn = true;
				State.turn++;
			}
		}
	});
}

main();
