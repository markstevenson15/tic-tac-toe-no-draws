/**
 * Unit tests for Tic-Tac-Toe Game Engine (Center Tie-Breaker Variant)
 */

const assert = require('assert');
const { GameState, WINNING_LINES, CENTER_COORD } = require('../src/game.js');

console.log('Running Game Engine Unit Tests (Center Tie-Breaker Variant)...');

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

// Test 2: Standard Diagonal Win
{
  const game = new GameState();
  // X: (0,0), O: (0,1), X: (1,1), O: (0,2), X: (2,2)
  game.makeMove(0, 0); // X
  game.makeMove(0, 1); // O
  game.makeMove(1, 1); // X (center)
  game.makeMove(0, 2); // O
  const res = game.makeMove(2, 2); // X completes main diagonal
  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'X');
  assert.strictEqual(res.winReason, 'LINE');
  assert.strictEqual(res.winningLines[0].id, 'diag-main');
  console.log('✔ Test 2 Passed: Standard Diagonal Win');
}

// Test 3: Cat's Game Center Tie-Breaker Resolution (Winner: O)
{
  const game = new GameState();
  // Board ending in a full Cat's game where O holds the center cell (1, 1):
  // X O X
  // X O O
  // O X X
  game.makeMove(0, 0); // 1. X
  game.makeMove(1, 1); // 2. O (Center Anchor!)
  game.makeMove(0, 2); // 3. X
  game.makeMove(0, 1); // 4. O
  game.makeMove(2, 1); // 5. X
  game.makeMove(1, 2); // 6. O
  game.makeMove(1, 0); // 7. X
  game.makeMove(2, 0); // 8. O
  const res = game.makeMove(2, 2); // 9. X fills board

  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'O', 'Center owner O must be declared winner');
  assert.strictEqual(res.winReason, 'CENTER_TIEBREAKER');
  console.log('✔ Test 3 Passed: Cat\'s Game resolved by Center Tie-Breaker (Winner O)');
}

// Test 4: Cat's Game Center Tie-Breaker Resolution (Winner: X)
{
  const game = new GameState();
  // Board ending in Cat's game where X holds center cell:
  // O X O
  // O X X
  // X O O
  // Moves:
  // 1. X (1,1) [Center]
  // 2. O (0,0)
  // 3. X (0,1)
  // 4. O (0,2)
  // 5. X (1,2)
  // 6. O (1,0)
  // 7. X (2,0)
  // 8. O (2,1)
  // 9. X (2,2) - but wait, does X (2,0), (1,1), (0,2) form anti-diagonal? O is at (0,2).
  // Let's verify:
  // Row 0: O(0,0), X(0,1), O(0,2)
  // Row 1: O(1,0), X(1,1), X(1,2)
  // Row 2: X(2,0), O(2,1), X(2,2)
  // Check lines for X:
  // X has (0,1), (1,1), (1,2), (2,0), (2,2)
  // Rows: none (0,1 alone; 1,1 and 1,2; 2,0 and 2,2)
  // Cols: (0,1),(1,1),(2,1) has O at 2,1; (1,2),(2,2) only 2; (2,0) alone
  // Diags: (0,0) is O; anti: (0,2) is O.
  // No lines for X!
  // Check lines for O:
  // O has (0,0), (0,2), (1,0), (2,1). Total 4.
  // Rows: (0,0) and (0,2)
  // Cols: (0,0) and (1,0)
  // Diags: (0,0) is O, (1,1) is X, (2,2) is X; anti: (0,2) is O, (1,1) is X, (2,0) is X.
  // No lines for O!
  game.makeMove(1, 1); // 1. X (Center Anchor)
  game.makeMove(0, 0); // 2. O
  game.makeMove(0, 1); // 3. X
  game.makeMove(0, 2); // 4. O
  game.makeMove(1, 2); // 5. X
  game.makeMove(1, 0); // 6. O
  game.makeMove(2, 0); // 7. X
  game.makeMove(2, 1); // 8. O
  const res = game.makeMove(2, 2); // 9. X fills board

  assert.strictEqual(res.status, 'FINISHED');
  assert.strictEqual(res.winner, 'X', 'Center owner X must be declared winner');
  assert.strictEqual(res.winReason, 'CENTER_TIEBREAKER');
  console.log('✔ Test 4 Passed: Cat\'s Game resolved by Center Tie-Breaker (Winner X)');
}

// Test 5: Move validations
{
  const game = new GameState();
  game.makeMove(0, 0);
  const dup = game.makeMove(0, 0);
  assert.strictEqual(dup.success, false, 'Cannot play in occupied cell');
  console.log('✔ Test 5 Passed: Occupied cell validation');
}

console.log('ALL UNIT TESTS PASSED SUCCESSFULLY!');
