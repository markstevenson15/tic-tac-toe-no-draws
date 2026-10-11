# Toroidal Tic-Tac-Toe (With Center-Square Tie-Breaker)

## Quick Overview
Toroidal Tic-Tac-Toe is a two-player game played on a standard 3×3 grid. It preserves the classic feel, symbols, and turn structure of traditional Tic-Tac-Toe, but introduces two crucial rules ensuring that **a game can never end in a draw** and **always terminates in at most 9 moves**.

---

## Equipment & Setup
* **Board:** A standard 3×3 grid (9 squares total).
* **Players:** Two players — **Player X** and **Player O**.
* **Starting Player:** Player X moves first.

---

## Rules of Play

1. **Alternating Turns:**
   Players alternate turns placing their respective symbol (X or O) into any unoccupied square on the 3×3 board. Once placed, marks cannot be moved or removed.

2. **Primary Win Condition (3-in-a-Row on a Torus):**
   The first player to achieve three of their marks in an unbroken line wins immediately.
   Unlike standard Tic-Tac-Toe, the board is **toroidal** (wrap-around topology, like *Asteroids* or *Pac-Man*):
   * **Horizontal lines (3):** Any complete row.
   * **Vertical lines (3):** Any complete column.
   * **Standard diagonals (2):** Top-left to bottom-right, and top-right to bottom-left.
   * **Wrap-around diagonals (4):** Diagonals that wrap across opposite borders (e.g., Top-Center $\rightarrow$ Middle-Right $\rightarrow$ Bottom-Left, or Top-Right $\rightarrow$ Middle-Left $\rightarrow$ Bottom-Center).
   
   There are **12 winning lines** in total.

3. **The Center-Square Tie-Breaker Rule:**
   If all 9 squares on the board are occupied and neither player has achieved a primary 3-in-a-row (such as when playing under standard 8-line restrictions or edge-case disputes), **the player controlling the center square (the middle cell) is immediately declared the winner.**

4. **No Draws, Guaranteed Termination:**
   * Because every move occupies an empty cell on a 9-cell grid, the game terminates in **at most 9 moves**.
   * By the combinatorial geometry of a 3×3 Torus (the affine plane $\text{AG}(2,3)$), any 5 marks on the board must contain at least one line of 3.
   * Furthermore, because the center square cannot remain empty once all 9 cells are filled, the tie-breaker guarantees that a winner is always deterministically decided.
   * **A tie or draw is impossible.**

---

## Winning Line Reference (All 12 Toroidal Lines)

Using board coordinates `(row, col)` where rows and columns are indexed `0, 1, 2`:

| Line Type | Coordinate 1 | Coordinate 2 | Coordinate 3 | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Row 0** | (0, 0) | (0, 1) | (0, 2) | Top horizontal |
| **Row 1** | (1, 0) | (1, 1) | (1, 2) | Middle horizontal |
| **Row 2** | (2, 0) | (2, 1) | (2, 2) | Bottom horizontal |
| **Col 0** | (0, 0) | (1, 0) | (2, 0) | Left vertical |
| **Col 1** | (0, 1) | (1, 1) | (2, 1) | Center vertical |
| **Col 2** | (0, 2) | (1, 2) | (2, 2) | Right vertical |
| **Diag Main** | (0, 0) | (1, 1) | (2, 2) | Classic main diagonal |
| **Diag Anti** | (0, 2) | (1, 1) | (2, 0) | Classic anti-diagonal |
| **Wrap Diag 1** | (0, 1) | (1, 2) | (2, 0) | Shifted main diagonal |
| **Wrap Diag 2** | (0, 2) | (1, 0) | (2, 1) | Shifted main diagonal |
| **Wrap Anti 1** | (0, 0) | (1, 2) | (2, 1) | Shifted anti-diagonal |
| **Wrap Anti 2** | (0, 1) | (1, 0) | (2, 2) | Shifted anti-diagonal |
