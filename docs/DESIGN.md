# Design Document: Tic-Tac-Toe (Center Tie-Breaker Variant)

## 1. Reading of the Brief & Resolving Ambiguity

### The Brief
The task requires designing and implementing a single two-player Tic-Tac-Toe variant satisfying two non-negotiable invariants:
1. **No draw:** There is no terminal state in which neither player has won.
2. **Always terminates:** There is no line of play that continues indefinitely.

Technical constraints require:
* Pure HTML, CSS, JavaScript (runnable with `python -m http.server`, no build step, no backend).
* Human vs. Human gameplay in modern Chrome.
* Plain-English rules in `docs/RULES.md`.
* Design rationale, rejected alternatives, and proof in `docs/DESIGN.md`.
* Natural git commit history where each commit includes the timestamped `.jsonl` session transcript under `transcript/`.

### Ambiguity & Principle of Parsimony (Occam's Razor)
* **The Ambiguity:** The brief states: *"Rules of the variant are yours to invent. It must remain recognizably tic-tac-toe, but not limited to the followings: a 3×3 grid, two players, X and O, alternating turns... Whether your rule variant is original. It only has to be correct and defended."*
* **The Decision:** Rather than introducing unnecessary topological shifts (such as cylindrical or toroidal wrap-around geometries) or tracking piece counts, we apply the **Principle of Minimal Intervention**:
  * Preserve the classic 3×3 grid.
  * Preserve the two symbols (X and O) and alternating turn structure.
  * Preserve the 8 standard winning lines (3 rows, 3 columns, 2 diagonals).
  * **The Single Modification:** When all 9 cells are full and no 3-in-a-row exists, the player controlling the **Center Square** (row 2, column 2 in 1-indexed notation; array index `[1, 1]`) wins the game.
* **Why This Variant Wins:**
  * **Cognitive Load:** Any stranger who knows Tic-Tac-Toe can play immediately without learning non-standard diagonal wraps.
  * **Purity:** Standard Tic-Tac-Toe only ever draws when all 9 squares are full. By redefining only the terminal draw state into a deterministic win condition based on the board's most contested tactical anchor (the center square), draws are eliminated with zero bloat.

---

## 2. Rule Sets Considered and Rejected

| Variant Considered | Description | Reason for Rejection |
| :--- | :--- | :--- |
| **FIFO / Oldest Piece Fades (3-Piece Limit)** | Each player may only have 3 pieces on the board; placing a 4th piece removes the player's oldest piece. | **Violates "Always Terminates":** Allows infinite non-terminating move cycles. Imposing an artificial turn cap feels arbitrary and weakens the game. |
| **Toroidal (Wrap-Around) Geometry** | Edges wrap around like a torus (12 lines). By Cap Set theorem in $AG(2,3)$, any 5 marks contain a line. | **Rejected for Complexity:** Adds 4 non-intuitive wrap diagonals that confuse casual human players. Overcomplicates the task when a simpler variant satisfies the brief. |
| **Notakto (Shared-Piece Misère)** | Both players place 'X'; first to make 3-in-a-row loses. | **Lacks Two-Player Identity:** Eliminates player 'O', sacrificing the core recognizability of classic Tic-Tac-Toe. |
| **Hex / Bridg-It Connection Mechanics** | Players connect opposite sides of a board to win. | **Genre Shift:** Changes the core objective from alignment (3-in-a-row) to graph connectivity, making it Hex rather than Tic-Tac-Toe. |
| **Corner-Count Tie-Breaker** | If 9 cells are filled, player with more corners wins. | Inferior to Center Square because Center Square ownership is uniquely contested from Turn 1, whereas corner counting adds arithmetic overhead. |

---

## 3. Mathematical Defense: Proof of No Draws & Termination

### A. Termination Argument (Bounded Horizon)
1. The game is played on a fixed grid of 9 cells.
2. A move consists strictly of placing a mark into an empty cell.
3. No marks are moved, replaced, or removed at any point in the game.
4. The number of empty cells strictly decreases by 1 on each turn.
5. Therefore, the game state graph is a finite Directed Acyclic Graph (DAG) with maximum depth $N = 9$.
6. No cycle or infinite line of play can exist. **The game always terminates in at most 9 moves.**

### B. Proof That Draws Are Impossible
1. Any terminal state of the game must occur at move count $M \in \{5, 6, 7, 8, 9\}$.
2. **Case 1: $M < 9$**
   * If the game terminates before move 9, it terminates solely because an active player formed a standard 3-in-a-row (horizontal, vertical, or diagonal).
   * By definition, that player is declared the winner.
3. **Case 2: $M = 9$**
   * If the game reaches move 9, all 9 squares of the board are filled.
   * If a player achieves a 3-in-a-row on move 9, that player wins immediately.
   * If neither player has formed a 3-in-a-row (a classic Cat's Game), the Center Tie-Breaker rule activates.
   * Because all 9 squares are filled, the center square (row 2, column 2 in 1-indexed notation; array index `[1, 1]`) **must be occupied**.
   * It cannot be empty.
   * It cannot be shared (each cell holds exactly one symbol).
   * Therefore, the center square is occupied either by 'X' or by 'O'.
   * The player holding the center square is deterministically crowned the winner.
4. In all reachable terminal states, exactly one player is declared the winner. **A draw is impossible.**

### C. Exhaustive State-Space Verification
To eliminate all human error, we verified the entire game tree via an automated depth-first search (`verify_no_draws.py`):
* **Total Unique Terminal Game Paths:** 255,168
  * Player X Wins by 3-in-a-row: **131,184** (51.4%)
  * Player O Wins by 3-in-a-row: **77,904** (30.5%)
  * Player Wins via Center Tie-Breaker: **46,080** (18.1%)
  * Terminal Games Ending in a Draw: **0 (Zero)**
* **Maximum Tree Depth:** 9 moves.

Every single reachable terminal state in the entire game tree was evaluated. Zero resulted in a draw.

---

## 4. Current Status & Known Edge Cases

### Status
* Game Engine (`src/game.js`): Fully implemented and tested with standard 8 lines and center tie-breaker.
* Playable Web UI (`index.html`, `style.css`, `src/app.js`): Functional, responsive, dark-mode themed, zero build step.
* Unit Test Suite (`tests/game.test.js`): 100% passing.
* Verification Engine (`verify_no_draws.py`): 100% passing with 0 draws across 255,168 terminal states.
* Transcripts: All development steps tracked with timestamped `.jsonl` snapshots per commit, alongside cross-verification sessions from Perplexity (GPT-6.1 Sol).

### Multi-Model Tooling & Evaluation
* **Development Agent:** Google Antigravity IDE (powered by Gemini 3.8 Flash) was utilized for code generation, mathematical DFS verification, UI styling, and git history management (`transcript/transcript_antigravity_gemini.jsonl`).
* **Evaluation Agent:** Perplexity AI (powered by GPT-6.1 Sol) was utilized for independent evaluation of the task brief, cross-checking edge-case requirements against the specification (`transcript/transcript_perplexity_gpt6.1_sol.jsonl`).

### Strategic Nuance (Center Control)
Because the center cell acts as both the primary tactical pivot for lines and the tie-breaker decider, Player 1 (X) moving first can claim the center square on turn 1. Player 2 (O) must immediately counter tactically to create dual threats or block X's paths. This intensifies the strategic tension of ordinary Tic-Tac-Toe without altering its familiar rules.
