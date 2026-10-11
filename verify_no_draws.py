#!/usr/bin/env python3
"""
Exhaustive Game-Tree Verification Script for Tic-Tac-Toe: Center Tie-Breaker Variant

This script exhaustively checks every possible legal game trajectory from an empty board
to verify the two core invariants required by the candidate brief:
  1. No Draw: Zero terminal states end without a declared winner.
  2. Always Terminates: Every line of play terminates in <= 9 moves.

Variant Specification:
  - Standard 3x3 board.
  - 8 classic winning lines (3 rows, 3 cols, 2 diagonals).
  - Center Tie-Breaker: When all 9 cells are occupied with no 3-in-a-row,
    the player controlling the center cell (row 2, column 2; array index [1, 1] / flat index 4) is crowned the winner.
"""

import sys

# Board positions: 0 to 8
# 0 1 2
# 3 4 5
# 6 7 8
CENTER_CELL = 4  # (row 2, col 2 / 0-indexed [1, 1])

STANDARD_LINES = [
    # Rows
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    # Cols
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    # Diagonals
    (0, 4, 8), (2, 4, 6)
]

def check_win(board, player):
    return any(all(board[pos] == player for pos in line) for line in STANDARD_LINES)

def run_exhaustive_verification():
    print("=" * 65)
    print("EXHAUSTIVE GAME-TREE DFS SEARCH: Center Tie-Breaker Variant")
    print("=" * 65)

    stats = {
        'total_terminal_games': 0,
        'x_wins_line': 0,
        'o_wins_line': 0,
        'center_tiebreaker_wins': 0,
        'draws': 0,
        'max_depth': 0
    }

    board = ['.'] * 9

    def dfs(depth, turn):
        if depth > stats['max_depth']:
            stats['max_depth'] = depth

        # Check if the player who just played won by completing a 3-in-a-row
        last_player = 'O' if turn == 'X' else 'X'
        if depth > 0 and check_win(board, last_player):
            stats['total_terminal_games'] += 1
            if last_player == 'X':
                stats['x_wins_line'] += 1
            else:
                stats['o_wins_line'] += 1
            return

        # Full board reached (Move 9) without a 3-in-a-row
        if depth == 9:
            stats['total_terminal_games'] += 1
            center_owner = board[CENTER_CELL]
            if center_owner in ('X', 'O'):
                stats['center_tiebreaker_wins'] += 1
            else:
                stats['draws'] += 1
            return

        # Explore branching moves
        for i in range(9):
            if board[i] == '.':
                board[i] = turn
                next_turn = 'O' if turn == 'X' else 'X'
                dfs(depth + 1, next_turn)
                board[i] = '.'

    dfs(0, 'X')

    print(f"Total Unique Terminal Game Paths: {stats['total_terminal_games']:,}")
    print(f"  - Player X Wins (by 3-in-a-row):        {stats['x_wins_line']:,} ({stats['x_wins_line']/stats['total_terminal_games']*100:.1f}%)")
    print(f"  - Player O Wins (by 3-in-a-row):        {stats['o_wins_line']:,} ({stats['o_wins_line']/stats['total_terminal_games']*100:.1f}%)")
    print(f"  - Player Wins (Center Tie-Breaker):     {stats['center_tiebreaker_wins']:,} ({stats['center_tiebreaker_wins']/stats['total_terminal_games']*100:.1f}%)")
    print(f"  - Games Ending in Draw:                 {stats['draws']}")
    print(f"Maximum Game Tree Depth:                  {stats['max_depth']} moves")

    assert stats['draws'] == 0, f"FAILED: Encountered {stats['draws']} draw states!"
    assert stats['max_depth'] <= 9, f"FAILED: Depth exceeded 9 moves!"
    print("=" * 65)
    print(">> VERIFICATION SUCCESSFUL: 0 DRAWS, 100% DEFINITIVE RESOLUTION <<")
    print("=" * 65)

if __name__ == '__main__':
    run_exhaustive_verification()
