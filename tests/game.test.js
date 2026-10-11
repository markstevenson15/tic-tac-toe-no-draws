/**
 * Unit tests for Toroidal Tic-Tac-Toe Game Engine (src/game.js)
 */

const assert = require('assert');
const { GameState, WINNING_LINES } = require('../src/game.js');

console.log('Running Game Engine Unit Tests...');

// Test 1: Standard Horizontal Win
{
  const game = new GameState();
  // X: (0,0), O: (1,0), X: (0,1), O: (1,1), X: (0,2)
  game.makeMove(0, 0); // X
  game.makeMove(1, 0); // O
  game.makeMove(0, 1); // X
  game.makeMove(1, 1); // O
  const res = game.makeMove(0, 2); // X completes top row
  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'X');
  assert.strictEqual(res.winReason, 'LINE');
  assert.strictEqual(res.winningLines[0].id, 'row-0');
  console.log('✔ Test 1 Passed: Standard Horizontal Win');
}

// Test 2: Toroidal Wrap-Around Diagonal Win
{
  const game = new GameState({ toroidalEnabled: true });
  // Wrap diagonal 1: (0, 1), (1, 2), (2, 0)
  game.makeMove(0, 1); // X
  game.makeMove(0, 0); // O
  game.makeMove(1, 2); // X
  game.makeMove(1, 1); // O
  const res = game.makeMove(2, 0); // X completes wrap diagonal 1
  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'X');
  assert.strictEqual(res.winReason, 'LINE');
  assert.strictEqual(res.winningLines[0].id, 'wrap-main-1');
  console.log('✔ Test 2 Passed: Toroidal Wrap-Around Diagonal Win');
}

// Test 3: Center-Square Tie-Breaker Win in Standard Mode
{
  const game = new GameState({ toroidalEnabled: false });
  // Classical Cat's game sequence where O holds the center square:
  // Board:
  // X O X
  // X O O
  // O X X
  // Moves:
  // 1: X (0,0)
  // 2: O (1,1) [Center!]
  // 3: X (0,2)
  // 4: O (0,1)
  // 5: X (2,1)
  // 6: O (1,2)
  // 7: X (1,0)
  // 8: O (2,0)
  // 9: X (2,2)
  game.makeMove(0, 0); // 1. X
  game.makeMove(1, 1); // 2. O (Center)
  game.makeMove(0, 2); // 3. X
  game.makeMove(0, 1); // 4. O
  game.makeMove(2, 1); // 5. X
  game.makeMove(1, 2); // 6. O
  game.makeMove(1, 0); // 7. X
  game.makeMove(2, 0); // 8. O
  const res = game.makeMove(2, 2); // 9. X

  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'O', 'Center owner O should be the winner');
  assert.strictEqual(res.winReason, 'CENTER_TIEBREAKER');
  console.log('✔ Test 3 Passed: Center-Square Tie-Breaker triggers cleanly');
}

// Test 4: Move validations
{
  const game = new GameState();
  game.makeMove(0, 0);
  const dup = game.makeMove(0, 0);
  assert.strictEqual(dup.success, false, 'Cannot play in occupied cell');
  console.log('✔ Test 4 Passed: Occupied cell validation');
}

console.log('ALL UNIT TESTS PASSED SUCCESSFULLY!');
