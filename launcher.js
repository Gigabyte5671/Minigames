import { exec } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import games from './games.json' assert { type: 'json' };

let renderInterval = undefined;
let selectedGame = 0;
let gameRunning = false;

function render () {
	console.clear();
	console.log('Select a game:');

	let i = 0;
	for (const game of Object.entries(games)) {
		console.log(`  ${i === selectedGame ? '\x1b[36m>' : '•'} ${game[0]}\x1b[0m`);
		i++;
	}

	if (typeof renderInterval === 'undefined') {
		renderInterval = setInterval(render, 50);
	}
}

function main () {
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', async (key) => {
		if (gameRunning) {
			return;
		}

		if (key.toString() === '\u0003') { process.exit(); } // Ctrl-C
	
		if (key.toString() === '\u001B\u005B\u0041') { // Up
			selectedGame = Math.max(selectedGame - 1, 0);
		}
		if (key.toString() === '\u001B\u005B\u0042') { // Down
			selectedGame = Math.min(selectedGame + 1, Object.entries(games).length - 1);
		}
		if (key.toString() === '\u000D' || key.toString() === '\u001B\u005B\u0043' || key.toString() === '\u0020') { // Enter, Right, or Space
			clearInterval(renderInterval);
			console.clear();
			process.stdin.setRawMode(false);
			gameRunning = true;
			import(Object.entries(games)[selectedGame][1].package);
		}
	});

	render();
}

try {
	console.clear();
	console.log('Loading...');
	await readdir('./node_modules');
	main();
} catch {
	exec('npm i', () => {
		main();
	});
}
