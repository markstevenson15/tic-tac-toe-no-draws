# Tic-Tac-Toe: Center Tie-Breaker Variant

## Quick Overview
This variant is played on a standard 3×3 grid with two players (X and O). It preserves the classic rules, symbols, and turn structure of traditional Tic-Tac-Toe, while modifying the terminal state resolution so that **a game can never end in a draw** and **always terminates in at most 9 moves**.

---

## Equipment & Setup
* **Board:** A standard 3×3 grid (9 squares total).
* **Players:** Two players — **Player X** and **Player O**.
* **Starting Player:** Player X moves first.

---

## Rules of Play

1. **Alternating Turns:**
   Players alternate turns placing their respective mark (X or O) into any unoccupied square on the 3×3 board. Once placed, marks cannot be moved or removed.

2. **Primary Win Condition (Classic 3-in-a-Row):**
   The first player to place three of their marks in an unbroken horizontal, vertical, or diagonal line wins immediately.
   There are exactly **8 winning lines**:
   * **3 Horizontal Rows:** Top, Middle, Bottom
   * **3 Vertical Columns:** Left, Center, Right
   * **2 Diagonals:** Top-Left to Bottom-Right, Top-Right to Bottom-Left

3. **The Center Tie-Breaker Rule (No Draws):**
   If all 9 squares on the board are occupied and neither player has formed a 3-in-a-row (a classic "Cat's Game"), **the player occupying the Center Square (the middle cell at row 2, column 2) is declared the winner.**

4. **Guaranteed Termination:**
   * Because every move permanently claims one empty square on a finite 9-cell board, the game must conclude in **at most 9 moves**.
   * When all 9 squares are filled, the center square is guaranteed to be occupied by exactly one player.
   * Therefore, every game yields a definitive winner. **A draw is impossible.**

---

## Line Reference Table

Using coordinates `(row, col)` from 1 to 3:

| Line Name | Cell 1 | Cell 2 | Cell 3 | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Row 1** | (1, 1) | (1, 2) | (1, 3) | Top row |
| **Row 2** | (2, 1) | (2, 2) | (2, 3) | Middle row |
| **Row 3** | (3, 1) | (3, 2) | (3, 3) | Bottom row |
| **Col 1** | (1, 1) | (2, 1) | (3, 1) | Left column |
| **Col 2** | (1, 2) | (2, 2) | (3, 2) | Center column |
| **Col 3** | (1, 3) | (2, 3) | (3, 3) | Right column |
| **Main Diagonal** | (1, 1) | (2, 2) | (3, 3) | Top-left to bottom-right |
| **Anti Diagonal** | (1, 3) | (2, 2) | (3, 1) | Top-right to bottom-left |

*Tie-Breaker Anchor Cell:* **(2, 2)** (Middle / Center cell).
