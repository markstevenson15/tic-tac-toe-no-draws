# Tic-Tac-Toe: Center Tie-Breaker Variant (No Draws)

A two-player Tic-Tac-Toe variant satisfying the strict requirement that **no game can ever end in a draw** and **play always terminates in $\le 9$ moves**.

## The Variant Rule
Played on a classic 3×3 grid with two players (X and O), alternating turns, and 8 standard winning lines (3 rows, 3 columns, 2 diagonals):
* **Primary Win:** First to complete 3-in-a-row wins immediately.
* **Tie-Breaker:** If all 9 squares are occupied without a 3-in-a-row (a classic "Cat's Game"), **the player occupying the Center Square (2, 2) Anchor is declared the winner.**

Because all 9 squares are full, the center square is guaranteed to be occupied by exactly one player. Draws are mathematically impossible.

## Quick Start
No build step or external dependencies required.

```bash
# Run local HTTP server from repo root
python3 -m http.server 8000
```
Open `http://localhost:8000` in Google Chrome.

## Automated Verification & Tests
```bash
# Run unit tests
node tests/game.test.js

# Run exhaustive game-tree verification (evaluates all 255,168 terminal paths)
python3 verify_no_draws.py
```

## Documentation
* [`docs/RULES.md`](docs/RULES.md): Printable rules of play.
* [`docs/DESIGN.md`](docs/DESIGN.md): Design rationale, rejected variants, and proof of no draws.
* [`transcript/`](transcript/): Machine-generated AI dev session logs and commit snapshots.
