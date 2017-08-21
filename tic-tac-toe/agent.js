/**
 * Created by fengchaoyi on 2017/8/11.
 */

const _ = require('lodash');

module.exports = class Agent {
  constructor(learning_rate = 0.5, epsilon = 0.3, symbol = 1) {
    this.learning_rate = learning_rate;
    this.epsilon = epsilon;
    this.symbol = symbol;
    this.historyStates = []; // record all the history states of the agent
    this.mapStateToValue = {};
  }

  setEnvironment(env) {
    if (env) {
      this.env = env;
      this.analyzeEnvironment();

      return true;
    }
    throw 'Environment cannot be undefined!';
  }

  analyzeEnvironment() {
    // console.log('Analysis!');
    // let the agent know about the game, know about win or lose
    const {size, p1, p2} = this.env;
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
            mapStateToValue[environment.getCurrentState()] = environment.getResult(myself) === 1? 1:0; // reward = 1 when winning, otherwise 0
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
    this.mapStateToValue = getMapStateToValue(_.cloneDeep(this.env), 0, 0, myself);
    // console.log('I have finished learning the game');
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
	    returnStep = options[_.random(_.size(options) - 1)];
    } else {
      // pick an option with the best value
      let bestChoice = null;
      let bestValue = -1;
      _.each(options, (option) => {
      	const i = option[0];
	      const j = option[1];
        const currentEnv = _.cloneDeep(this.env);
        currentEnv.board[i][j] = this.symbol;
        if (this.getValue(currentEnv) > bestValue) {
          bestValue = this.getValue(currentEnv);
          bestChoice = [i, j];
        }
      });
      if (bestChoice){
	      returnStep = bestChoice;
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
    return this.mapStateToValue[env.getCurrentState()];
  }

  // learn from an episode of game
  // V(prev_state) = V(prev_state) + alpha*(V(next_state) - V(prev_state))
  upgrade(env) {
    const reward = env.getResult(this.symbol);
    let value = reward;
    // learn!
    _.each(_.reverse(this.historyStates), (historyState) => {
      this.mapStateToValue[historyState] = this.mapStateToValue[historyState] + this.learning_rate * (value - this.mapStateToValue[historyState]);
      value = this.mapStateToValue[historyState];
    });
    this.clearRecords();
  }
}