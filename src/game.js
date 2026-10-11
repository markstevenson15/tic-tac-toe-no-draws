/**
 * Tic-Tac-Toe Game Engine (Center Tie-Breaker Variant)
 * 
 * Invariants guaranteed:
 * 1. No Draw: Every terminal state has a definitive winner.
 * 2. Always Terminates: Exactly 9 moves maximum (N <= 9).
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.TicTacToeVariant = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // The 8 classic winning lines of Tic-Tac-Toe
  const WINNING_LINES = [
    // 3 Horizontal Rows
    { id: 'row-0', name: 'Top Row', coords: [[0, 0], [0, 1], [0, 2]] },
    { id: 'row-1', name: 'Middle Row', coords: [[1, 0], [1, 1], [1, 2]] },
    { id: 'row-2', name: 'Bottom Row', coords: [[2, 0], [2, 1], [2, 2]] },

    // 3 Vertical Columns
    { id: 'col-0', name: 'Left Column', coords: [[0, 0], [1, 0], [2, 0]] },
    { id: 'col-1', name: 'Center Column', coords: [[0, 1], [1, 1], [2, 1]] },
    { id: 'col-2', name: 'Right Column', coords: [[0, 2], [1, 2], [2, 2]] },

    // 2 Classic Diagonals
    { id: 'diag-main', name: 'Main Diagonal', coords: [[0, 0], [1, 1], [2, 2]] },
    { id: 'diag-anti', name: 'Anti Diagonal', coords: [[0, 2], [1, 1], [2, 0]] }
  ];

  // The Center Anchor cell (row 1, col 1 in 0-indexed coords)
  const CENTER_COORD = [1, 1];

  class GameState {
    constructor() {
      this.reset();
    }

    reset() {
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];
      this.currentTurn = 'X'; // X always moves first
      this.moveHistory = [];
      this.status = 'IN_PROGRESS'; // 'IN_PROGRESS' | 'FINISHED'
      this.winner = null; // 'X' | 'O' | null
      this.winReason = null; // 'LINE' | 'CENTER_TIEBREAKER'
      this.winningLines = [];
    }

    checkWinningLines(player) {
      const completed = [];
      for (const line of WINNING_LINES) {
        const isMatch = line.coords.every(([r, c]) => this.board[r][c] === player);
        if (isMatch) {
          completed.push(line);
        }
      }
      return completed;
    }

    makeMove(row, col) {
      if (this.status === 'FINISHED') {
        return { success: false, reason: 'Game has already finished' };
      }

      if (row < 0 || row > 2 || col < 0 || col > 2) {
        return { success: false, reason: 'Invalid coordinates' };
      }

      if (this.board[row][col] !== '') {
        return { success: false, reason: 'Cell is already occupied' };
      }

      const activePlayer = this.currentTurn;
      this.board[row][col] = activePlayer;
      this.moveHistory.push({
        player: activePlayer,
        row,
        col,
        moveNumber: this.moveHistory.length + 1
      });

      // 1. Check primary win condition (any 3-in-a-row)
      const winningLines = this.checkWinningLines(activePlayer);
      if (winningLines.length > 0) {
        this.status = 'FINISHED';
        this.winner = activePlayer;
        this.winReason = 'LINE';
        this.winningLines = winningLines;
        return {
          success: true,
          status: this.status,
          winner: this.winner,
          winReason: this.winReason,
          winningLines: this.winningLines
        };
      }

      // 2. Check full board state (Move 9 tie-breaker)
      if (this.moveHistory.length === 9) {
        // Cat's Game Resolution: Center Square Anchor owner wins
        const centerOwner = this.board[CENTER_COORD[0]][CENTER_COORD[1]];
        this.status = 'FINISHED';
        this.winner = centerOwner;
        this.winReason = 'CENTER_TIEBREAKER';
        this.winningLines = [];
        return {
          success: true,
          status: this.status,
          winner: this.winner,
          winReason: this.winReason,
          winningLines: this.winningLines
        };
      }

      // 3. Switch turn
      this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
      return {
        success: true,
        status: this.status,
        currentTurn: this.currentTurn
      };
    }
  }

  return {
    GameState,
    WINNING_LINES,
    CENTER_COORD
  };
});
