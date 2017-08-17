/**
 * Created by fengchaoyi on 2017/8/11.
 */

const _ = require('lodash');

module.exports = class Env {
	constructor(size = 3, p1 = 1, p2 = 2) {
		// initialize board with 0s
		this.board = [];
		this.size = size;
		for (let i = 0; i < size; i++) {
			let row = [];
			for (let j = 0; j < size; j++) {
				row.push(0);
			}
			this.board.push(row);
		}

		// symbols for each side
		this.p1 = p1;
		this.p2 = p2;
		this.ended = false;
	}

	// get a value which represents the current state,
	// simply concatenates all the numbers from each row
	getCurrentState() {
		return (_.join(_.map(this.board, (row) => _.join(row))));
	}

	// whether the game is ended?
	// isGameEnded() {
	//   this.ended = _.size(_.filter(this.board, (row) => {
	//       return !_.every(row, (num) => num !== 0);
	//     })) <= 0;
	//   return this.ended;
	// }

	// get result of the side in current env
	// -1 for lose, 0 for draw, 1 for win, -2 for not ended
	getResult(side) {
		if (side !== this.p1 && side !== this.p2) {
			console.error('wrong side for getResult func!');
		}

		this.ended = true;
		// consider rows, columns and diagnals
		let looking_conditions = [];
		for (let i = 0; i < this.size; i++) {
			looking_conditions.push(this.board[i]);
			looking_conditions.push([this.board[0][i], this.board[1][i], this.board[2][i]]);
		}
		let diagnals = [[], []]
		for (let i = 0; i < this.size; i++) {
			diagnals[0].push(this.board[i][i]);
			diagnals[1].push(this.board[this.size - i - 1][i]);
		}
		looking_conditions = _.concat(diagnals, looking_conditions);

		let result;
		_.each(looking_conditions, (condition) => {
			if (_.every(condition, (num) => (num === this.p1 || num === this.p2))) {
				result = side === this.p1 ? 1 : -1; // somebody win
			}
		});
		if (result === 1 || result === -1) {
			return result;  // win or lose
		}

		// if no zero is present, it's draw, otherwise it's not ended;
		const isDraw = _.size(_.filter(this.board, (row) => {
			return !_.every(row, (num) => num !== 0);
		})) <= 0;
		if (isDraw) {
			return 0; // draw
		}
		// game continues
		this.ended = false;
		return -2;
	}
};