// Import chai.
let chai = require('chai'),
  path = require('path');

const expect = require('chai').expect;

// Import the Rectangle class.
let Env = require(path.join(__dirname, '..', 'env'));

describe('Environment', () => {
  it('should set board correctly', () => {
    const env = new Env(3, 1, -1);
    expect(env.board).to.not.be.undefined;
	  env.board = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
    expect(env.getCurrentState()).to.equal('1,1,1,1,1,1,1,1,1');
    env.board = [[1,1,1], [0,0,0], [0,0,-1]];
    // -1 for lose, 0 for draw, 1 for win, -2 for not ended
    expect(env.getCurrentState()).to.equal('1,1,1,0,0,0,0,0,-1');
    expect(env.getResult(1)).to.equal(1);
    expect(env.getResult(-1)).to.equal(-1);

	  env.board = [[1,0,-1], [0,1,0], [-1,0,1]];
	  // -1 for lose, 0 for draw, 1 for win, -2 for not ended
	  expect(env.getCurrentState()).to.equal('1,0,-1,0,1,0,-1,0,1');
	  expect(env.getResult(1)).to.equal(1);
	  expect(env.getResult(-1)).to.equal(-1);
  });
});