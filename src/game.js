/**
 * Toroidal Tic-Tac-Toe Game Engine
 * 
 * Invariants guaranteed:
 * 1. No Draw: Every terminal state has a definitive winner.
 * 2. Always Terminates: Exactly 9 moves maximum (N <= 9).
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.ToroidalTTT = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // All 12 winning lines on a 3x3 Torus (Affine Plane AG(2,3))
  const WINNING_LINES = [
    // 3 Horizontal Rows
    { id: 'row-0', name: 'Row 1', coords: [[0, 0], [0, 1], [0, 2]], type: 'row' },
    { id: 'row-1', name: 'Row 2', coords: [[1, 0], [1, 1], [1, 2]], type: 'row' },
    { id: 'row-2', name: 'Row 3', coords: [[2, 0], [2, 1], [2, 2]], type: 'row' },

    // 3 Vertical Columns
    { id: 'col-0', name: 'Col 1', coords: [[0, 0], [1, 0], [2, 0]], type: 'col' },
    { id: 'col-1', name: 'Col 2', coords: [[0, 1], [1, 1], [2, 1]], type: 'col' },
    { id: 'col-2', name: 'Col 3', coords: [[0, 2], [1, 2], [2, 2]], type: 'col' },

    // 2 Classic Diagonals
    { id: 'diag-main', name: 'Main Diagonal', coords: [[0, 0], [1, 1], [2, 2]], type: 'diagonal' },
    { id: 'diag-anti', name: 'Anti Diagonal', coords: [[0, 2], [1, 1], [2, 0]], type: 'diagonal' },

    // 4 Wrap-around Diagonals (Torus Topology)
    { id: 'wrap-main-1', name: 'Wrap Diagonal 1', coords: [[0, 1], [1, 2], [2, 0]], type: 'wrap-diagonal' },
    { id: 'wrap-main-2', name: 'Wrap Diagonal 2', coords: [[0, 2], [1, 0], [2, 1]], type: 'wrap-diagonal' },
    { id: 'wrap-anti-1', name: 'Wrap Anti-Diagonal 1', coords: [[0, 0], [1, 2], [2, 1]], type: 'wrap-diagonal' },
    { id: 'wrap-anti-2', name: 'Wrap Anti-Diagonal 2', coords: [[0, 1], [1, 0], [2, 2]], type: 'wrap-diagonal' }
  ];

  const CENTER_COORD = [1, 1]; // Middle square

  class GameState {
    constructor(options = {}) {
      this.toroidalEnabled = options.toroidalEnabled !== false; // Default true
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

    getActiveLines() {
      if (this.toroidalEnabled) {
        return WINNING_LINES;
      }
      // Traditional 8 lines (rows, cols, classic diagonals)
      return WINNING_LINES.filter(l => l.type !== 'wrap-diagonal');
    }

    checkWinningLines(player) {
      const activeLines = this.getActiveLines();
      const completed = [];
      for (const line of activeLines) {
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

      // 1. Check primary win condition (completed line)
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

      // 2. Check if board is full (9 moves)
      if (this.moveHistory.length === 9) {
        // Fallback Center-Square Tie-Breaker rule:
        // When all 9 cells are filled and no player has a 3-in-a-row,
        // the owner of the center cell (1, 1) wins immediately.
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

    setToroidalMode(enabled) {
      this.toroidalEnabled = !!enabled;
    }
  }

  return {
    GameState,
    WINNING_LINES,
    CENTER_COORD
  };
});
