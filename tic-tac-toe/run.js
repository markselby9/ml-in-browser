// run the tic-tac-toe AI in node.js

const Env = require('./env');
const Agent = require('./agent');

const Dolores = new Agent(0.5, 0.5, 1);
const Ted = new Agent(0.5, 0.5, -1);
const board = new Env(3, 1, -1);
Dolores.setEnvironment(board);  // give her the board
Dolores.analyzeEnvironment();
Ted.setEnvironment(board);  // give her the board
Ted.analyzeEnvironment();

console.log(Dolores);
console.log(Ted);

const playGame = (p1, p2, environment, draw = false) => {
	console.log('1', environment.board);
	let currentPlayer = Math.random() < 0.5 ? p1 : p2;
	p1.setEnvironment(environment);
	console.log('p1', environment.board);
	p2.setEnvironment(environment);
	console.log('p2', environment.board);
	console.log('environment.getResult(p1.symbol)', environment.getResult(p1.symbol), environment.board);
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
		console.log('debug', currentPlayer.symbol, step, environment.ended);
		environment.board[step[0]][step[1]] = currentPlayer.symbol;
		p1.recordStep(step);
		p2.recordStep(step);
	}
	console.log('p1 result:', environment.getResult(p1.symbol));
	console.log('board:', environment.board);
	p1.upgrade(environment);
	p2.upgrade(environment);
};

for (let i = 0; i < 100; i++) {
	console.log(i, Dolores.symbol, Ted.symbol);
	playGame(Dolores, Ted, new Env(3, Dolores.symbol, Ted.symbol))
}