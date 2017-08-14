// run the tic-tac-toe AI in node.js

const Env = require('./env');
const Agent = require('./agent');

const Dolores = new Agent(0.5, 0.5, 1);
const Ted = new Agent(0.5, 0.5, -1);
const board = new Env(3, 1, -1);
Dolores.setEnvironment(board);  // give her the board
Dolores.analyzeEnvironment();

console.log(Dolores);