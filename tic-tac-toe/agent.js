/**
 * Created by fengchaoyi on 2017/8/11.
 */

const _ = require('lodash');
const Decimal = require('decimal.js');

module.exports = class Agent {
	constructor(learning_rate = 0.5, epsilon = 0.1, symbol = 1) {
		this.learning_rate = learning_rate;
		this.epsilon = epsilon;
		this.symbol = symbol;
		this.historyStates = []; // record all the history states of the agent
		this.mapStateToValue = {};
		this.analysis = false; // analysis AI's thoughts
	}

	setEnvironment(env) {
		if (env) {
			this.env = env;
			this.analyzeEnvironment();

			return true;
		}
		throw 'Environment cannot be undefined!';
	}

	setAnalysis(doAnalysis) {
		this.analysis = !!doAnalysis;
	}

	analyzeEnvironment() {
		// console.log('Analysis!');
		// let the agent know about the game, know about win or lose
		const { size, p1, p2 } = this.env;
		let myself = p2, enemy = p1;
		if (this.symbol === p1) {
			myself = p1;
			enemy = p2;
		}

		const getMapStateToValue = (environment, i, j, myself) => {
			// analyze all possible situations
			let mapStateToValue = {};

			_.each([0, environment.p1, environment.p2], (sym) => {
				environment.board[i][j] = sym;
				// what now?
				if (i === 2) {
					if (j === 2) {
						// finished recursive call
						const res = environment.getResult(myself);
						if (res === 1) {
							// win
							mapStateToValue[environment.getCurrentState()] = new Decimal(1);
						}
						else if (res === -2) {
							// not ended
							mapStateToValue[environment.getCurrentState()] = new Decimal(0.5);
						}
						else if (res === 0 || res === -1) {
							// lose and draw
							mapStateToValue[environment.getCurrentState()] = new Decimal(0);
						}
					} else {
						const recursiveMap = getMapStateToValue(_.clone(environment), 0, j + 1, myself);
						mapStateToValue = _.merge(recursiveMap, mapStateToValue);
					}
				} else {
					const recursiveMap = getMapStateToValue(_.clone(environment), i + 1, j, myself);
					mapStateToValue = _.merge(recursiveMap, mapStateToValue);
				}
			});

      return mapStateToValue;
		};
		if (_.isEqual(this.mapStateToValue, {})) {
			this.mapStateToValue = getMapStateToValue(_.cloneDeep(this.env), 0, 0, myself);
		}
	}

	// make an action for the next step, return [i, j]
	makeAction() {
		if (this.env.ended) {
			// game is ended
			return;
		}
		let returnStep;
		const size = this.env.size;
		// throw a random number
		const rand = _.random(1, true);
		const options = [];
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (this.env.board[i][j] === 0) {
					options.push([i, j]);
				}
			}
		}
		if (rand < this.epsilon) {
			// randomly pick an available place
			if (this.analysis) {
				console.log('Im making a random move');
			}
			returnStep = options[_.random(_.size(options) - 1)];
		} else {
			// pick an option with the best value
			let bestChoice = null;
			let bestValue = -1;

			const optionValues = {}; // for analysis

			_.each(options, (option) => {
				const i = option[0];
				const j = option[1];
				const currentEnv = _.cloneDeep(this.env);
				currentEnv.board[i][j] = this.symbol;
				const thisOptionValue = this.getValue(currentEnv);

				optionValues[option] = thisOptionValue;

				if (thisOptionValue > bestValue) {
					bestValue = thisOptionValue;
					bestChoice = [i, j];
				}
			});
			if (bestChoice) {
				returnStep = bestChoice;
			}

			if (this.analysis) {
				console.log('Im actually thinking about this move');
				console.log(JSON.stringify(optionValues));
			}
		}
		if (!returnStep) {
			console.log('shouldnt');
		}
		// returnStep = options[_.random(_.size(options))];  // shouldn't go to this line
		return returnStep;
	}

	recordStep(step) {
		const newEnv = _.cloneDeep(this.env);
		newEnv.board[step[0]][step[1]] = this.symbol;
		this.historyStates.push(newEnv.getCurrentState());
	}

	clearRecords() {
		this.historyStates = [];
	}

	getValue(env) {
		return this.mapStateToValue[env.getCurrentState()].toNumber();
	}

	// learn from an episode of game
	// V(prev_state) = V(prev_state) + alpha*(V(next_state) - V(prev_state))
	upgrade(env) {
		const reward = env.getResult(this.symbol) === 1 ? 1 : 0;
		let target = reward;
		// learn!®
		_.each(this.historyStates, (historyState) => {
			let newValueOfThisState =
				new Decimal(this.mapStateToValue[historyState])
					.add(new Decimal(this.learning_rate).times(new Decimal(target).sub(new Decimal(this.mapStateToValue[historyState]))));
			this.mapStateToValue[historyState] = newValueOfThisState;
			// console.log('upgraded', _.size(Object.values(this.mapStateToValue).filter(v => (v !== 0 && v !== 1))));
			target = newValueOfThisState;
		});
		this.clearRecords();
	}
}