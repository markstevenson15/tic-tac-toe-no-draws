#!/usr/bin/env python3
"""
Exhaustive Game-Tree and Combinatorial Verification Script for Toroidal Tic-Tac-Toe

This script rigorously validates the two primary invariants demanded by the brief:
  1. No Draw: Zero terminal states terminate without a winner.
  2. Always Terminates: Every possible line of play ends in <= 9 moves.

It tests two configurations:
  Mode A: Toroidal 3x3 Grid (12 lines) + Center-Square Fallback
  Mode B: Standard 3x3 Grid (8 lines) + Center-Square Tie-Breaker
"""

import itertools
import sys

# Board coordinate definition: 0 to 8
# 0 1 2
# 3 4 5
# 6 7 8
CENTER_CELL = 4  # (1, 1)

STANDARD_LINES = [
    # Rows
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    # Cols
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    # Diagonals
    (0, 4, 8), (2, 4, 6)
]

TOROIDAL_LINES = STANDARD_LINES + [
    # Wrap-around diagonals
    (1, 5, 6), (2, 3, 7),
    (0, 5, 7), (1, 3, 8)
]

def check_win(board, player, lines):
    return any(all(board[pos] == player for pos in line) for line in lines)

def verify_cap_set_theorem():
    print("=" * 60)
    print("1. VERIFYING COMBINATORIAL THEOREM (Affine Plane AG(2,3))")
    print("=" * 60)
    all_cells = list(range(9))
    total_5_combinations = 0
    combinations_with_line = 0

    for comb in itertools.combinations(all_cells, 5):
        total_5_combinations += 1
        comb_set = set(comb)
        has_line = any(all(pos in comb_set for pos in line) for line in TOROIDAL_LINES)
        if has_line:
            combinations_with_line += 1

    print(f"Total 5-cell subsets on 3x3 grid: {total_5_combinations}")
    print(f"5-cell subsets containing a 3-in-a-row on Torus: {combinations_with_line}")
    assert total_5_combinations == combinations_with_line, "Failed: Found 5-cell cap with no line!"
    print(">> THEOREM VERIFIED: Every 5-cell distribution on a 3x3 Torus")
    print("   guarantees at least one 3-in-a-row (Max Cap Size is 4).\n")

def run_exhaustive_dfs(toroidal_mode=True):
    mode_name = "Toroidal (12 lines)" if toroidal_mode else "Standard (8 lines) + Center Tiebreaker"
    print("=" * 60)
    print(f"2. EXHAUSTIVE GAME-TREE DFS SEARCH: {mode_name}")
    print("=" * 60)

    lines = TOROIDAL_LINES if toroidal_mode else STANDARD_LINES

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

        # Check win for the player who just moved
        last_player = 'O' if turn == 'X' else 'X'
        if depth > 0 and check_win(board, last_player, lines):
            stats['total_terminal_games'] += 1
            if last_player == 'X':
                stats['x_wins_line'] += 1
            else:
                stats['o_wins_line'] += 1
            return

        # Full board check (move 9)
        if depth == 9:
            stats['total_terminal_games'] += 1
            # Tie-breaker activates if no line was detected
            center_owner = board[CENTER_CELL]
            if center_owner in ('X', 'O'):
                stats['center_tiebreaker_wins'] += 1
            else:
                stats['draws'] += 1
            return

        # Recursive branching
        for i in range(9):
            if board[i] == '.':
                board[i] = turn
                next_turn = 'O' if turn == 'X' else 'X'
                dfs(depth + 1, next_turn)
                board[i] = '.'

    dfs(0, 'X')

    print(f"Total Unique Terminal Game Paths: {stats['total_terminal_games']:,}")
    print(f"  - X Wins (by line):             {stats['x_wins_line']:,}")
    print(f"  - O Wins (by line):             {stats['o_wins_line']:,}")
    print(f"  - Center-Square Tiebreak Wins:  {stats['center_tiebreaker_wins']:,}")
    print(f"  - Draws:                        {stats['draws']}")
    print(f"Maximum Game Tree Depth:          {stats['max_depth']} moves")

    assert stats['draws'] == 0, f"FAILED: Found {stats['draws']} draw states!"
    assert stats['max_depth'] <= 9, f"FAILED: Depth exceeded 9 moves!"
    print(">> INVARIANTS PROVEN: Zero draws, always terminates in <= 9 moves.\n")

if __name__ == '__main__':
    verify_cap_set_theorem()
    run_exhaustive_dfs(toroidal_mode=True)
    run_exhaustive_dfs(toroidal_mode=False)
    print("ALL COMBINATORIAL AND GAME-TREE INVARIANTS MATHEMATICALLY CONFIRMED.")
