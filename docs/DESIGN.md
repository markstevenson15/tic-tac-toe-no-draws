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

### A. Formal Definitions & Model Assumptions
* Let $B$ be the finite set of board squares, with $|B| = 9$, and let $c \in B$ denote the center square (coordinates `[1, 1]` in 0-indexed notation).
* A board state is a function:
  $$s: B \rightarrow \{\emptyset, X, O\}$$
  where $\emptyset$ denotes an unoccupied square.

**Operational Assumptions:**
1. Each legal transition alters exactly one square from $\emptyset$ to the current player's mark ($X$ or $O$).
2. Marks cannot be moved, replaced, or removed once placed.
3. Play ends immediately when an active player completes a winning line (3-in-a-row horizontally, vertically, or diagonally).
4. If the board becomes full ($E(s) = 0$) without any completed 3-in-a-row line, the owner of the center square $s(c)$ wins.

---

### B. Formal Proof of Guaranteed Termination (Ranking / Variant Function)
Define the number of empty squares in state $s$ as:
$$E(s) = \left|\{b \in B : s(b) = \emptyset\}\right|$$

* **Initial State:** At the start of the game, all cells are unoccupied:
  $$E(s_0) = 9$$
* **Strict Monotonicity:** For every legal move from state $s$ to state $s'$:
  $$E(s') = E(s) - 1$$
* **Non-Negativity & Finite Bound:** For all valid board states, $E(s) \ge 0$. Therefore, after $n$ legal moves:
  $$E(s_n) = 9 - n \ge 0 \implies n \le 9$$

Because $E(s)$ is a strictly decreasing integer variant function bounded below by 0 (a standard ranking function technique for proving program termination), an infinite line of play or cycle of states is mathematically impossible. If a line is completed, play ends earlier ($n \in \{5, 6, 7, 8\}$); otherwise, the full-board rule terminates play at $n = 9$.

**Conclusion:** Every legal game is guaranteed to terminate in at most 9 moves.

---

### C. Formal Proof That Every Game Has Exactly One Winner (No Draws)
Let $W(s) \in \{X, O, \text{None}\}$ be the outcome function. The terminal game states are partitioned into two disjoint and exhaustive cases:

* **Case 1: A Player Completes a Winning Line ($n \le 9$)**
  * $\exists \text{ line } L \subset B \text{ such that } \forall b \in L, s(b) = p \in \{X, O\}$.
  * By rule definition, play terminates immediately upon line completion, and player $p$ is declared the winner ($W(s) = p$).
* **Case 2: Full Board Without a Winning Line ($n = 9$)**
  * The board is completely occupied, meaning $E(s) = 0$.
  * Hence, every cell on the board contains a mark, including the center square:
    $$s(c) \in \{X, O\}$$
  * Because each cell holds exactly one mark, the center square belongs to exactly one player. Under the fallback tie-breaker rule, player $s(c)$ is crowned the winner ($W(s) = s(c)$).

*Precedence Clarification:* A line completed on move 9 belongs strictly to Case 1—the line-win condition takes precedence over the center tie-breaker.

**Conclusion:** For every terminal state $s_{\text{term}}$, $W(s_{\text{term}}) \in \{X, O\}$. The set of draw states is strictly empty ($\mathcal{S}_{\text{draw}} = \emptyset$).

---

### D. Summary Theorem & Concise Formal Proof
> **Theorem.** *Every legal game terminates within nine moves and has exactly one winner.*
>
> **Proof.** Let $E$ denote the number of empty squares. Initially $E = 9$. Each legal move decreases $E$ by exactly one, and $E$ cannot be negative. Therefore, play cannot continue beyond nine moves.
> If a player completes a winning line, the game ends immediately with that player as the winner. Otherwise, the board eventually becomes full ($E = 0$). The center square must then contain exactly one player’s mark, and that player wins by the fallback rule. Since play stops at the first winning line, an earlier opponent victory cannot coexist with a later one. Thus every legal game terminates with exactly one winner. $\blacksquare$

*Note on Game Boundary:* The scope is legal play within one game: waiting, rejected clicks on occupied cells, and resetting the board are UI events, not additional legal moves in that game.

---

### E. Exhaustive State-Space Verification
To eliminate all human error and verify the theorem against any implementation edge case, an automated depth-first search over the complete game tree was executed via `verify_no_draws.py`:
* **Total Unique Terminal Game Paths:** 255,168
  * Player X Wins by 3-in-a-row: **131,184** (51.4%)
  * Player O Wins by 3-in-a-row: **77,904** (30.5%)
  * Player Wins via Center Tie-Breaker: **46,080** (18.1%)
  * Terminal Games Ending in a Draw: **0 (Zero)**
* **Maximum Tree Depth:** 9 moves.

Every single reachable terminal state in the entire game tree was computationally evaluated. Zero resulted in a draw.

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
