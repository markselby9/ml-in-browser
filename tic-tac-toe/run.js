// run the tic-tac-toe AI in node.js
const Env = require('./env');
const Agent = require('./agent');
const _ = require('lodash');

const Dolores = new Agent(0.5, 0.5, 1);
const Ted = new Agent(0.5, 0.5, -1);
const board = new Env(3, 1, -1);

Dolores.setEnvironment(board);  // give her the board
Dolores.analyzeEnvironment();
Ted.setEnvironment(board);  // give her the board
Ted.analyzeEnvironment();

// console.log(Dolores);
// console.log(Ted);

const playGame = (p1, p2, environment, draw = false) => {
	let currentPlayer = Math.random() < 0.5 ? p1 : p2;
	p1.setEnvironment(environment);
	p2.setEnvironment(environment);
	while (environment.getResult(p1.symbol) === -2 && !environment.ended) {  // not ended
		if (currentPlayer === p1) {
			currentPlayer = p2;
		} else {
			currentPlayer = p1;
		}
		const step = currentPlayer.makeAction();
		if (step === undefined) {
			console.log('ha');
		}
		environment.board[step[0]][step[1]] = currentPlayer.symbol;
		p1.recordStep(step);
		p2.recordStep(step);
		if (draw) {
			console.log('===');
			_.each(environment.board, line => {
				console.log(line);
			})
			console.log('===');
			const res = environment.getResult(p1.symbol);
			if (res === 1) {
				console.log('p1 wins')
			} else if (res === -1) {
				console.log('p2 wins')
			} else if (res === 0) {
				console.log('draw')
			}
			console.log('===');
		}
	}
	p1.upgrade(environment);
	p2.upgrade(environment);
};

for (let i = 0; i < 100; i++) {
	playGame(Dolores, Ted, new Env(3, Dolores.symbol, Ted.symbol), true);
	console.log('game', i, 'finished');
}
playGame(Dolores, Ted, new Env(3, Dolores.symbol, Ted.symbol));