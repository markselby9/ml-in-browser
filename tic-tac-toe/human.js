const util = require('util');
const _ = require('lodash');
const readlineSync = require('readline-sync');

module.exports =
	class Human {
		constructor(name = 'Williams', symbol = -1, env) {
			this.symbol = symbol;
			this.name = name;
		}

		setEnvironment(env) {
			if (env) {
				this.env = env;
				return true;
			}
			throw 'Environment cannot be undefined!';
		}

		makeAction() {
			console.log('current board, ', this.env.board);
			let valid = false;
			let step0, step1;
			while (!valid) {
				try {
					const step = readlineSync.question('Whats your move? input as [row, column]') || '';
					let arr = _.split(step, ' ');
					if (arr.length < 2) {
						continue;
					}
					step0 = arr[0];
					step1 = arr[1];
					valid = _.isNumber(_.parseInt(step0, 10)) && _.isNumber(_.parseInt(step1, 10)); // until valid input
					console.log(valid, step0, step1)
				} catch (e) {
				}
			}
			console.log('After your move, ', this.env.board);
			return [step0, step1];
		}

		recordStep() {
		};

		upgrade() {
		};
	};
