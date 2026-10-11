/**
 * UI Controller for Tic-Tac-Toe (Center Tie-Breaker Variant)
 */

document.addEventListener('DOMContentLoaded', () => {
  const { GameState } = window.TicTacToeVariant;

  const game = new GameState();

  // DOM Elements
  const boardEl = document.getElementById('board');
  const svgOverlay = document.getElementById('svg-overlay');
  const playerIndicator = document.getElementById('player-indicator');
  const turnText = document.getElementById('turn-text');
  const moveCountEl = document.getElementById('move-count');
  const bannerEl = document.getElementById('banner');
  const resetBtn = document.getElementById('btn-reset');
  const rulesBtn = document.getElementById('btn-rules');
  const modalRules = document.getElementById('modal-rules');
  const modalClose = document.getElementById('modal-close');

  // Initialize Board Cells
  const cells = [];
  boardEl.innerHTML = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (r === 1 && c === 1) {
        cell.classList.add('center-cell');
      }
      cell.addEventListener('click', () => handleCellClick(r, c));
      boardEl.appendChild(cell);
      cells.push(cell);
    }
  }

  function getCellElement(r, c) {
    return cells.find(el => parseInt(el.dataset.row) === r && parseInt(el.dataset.col) === c);
  }

  function getCellCenter(r, c) {
    const el = getCellElement(r, c);
    const rect = el.getBoundingClientRect();
    const boardRect = boardEl.getBoundingClientRect();
    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2
    };
  }

  function updateStatusDisplay() {
    moveCountEl.textContent = `${game.moveHistory.length} / 9`;

    if (game.status === 'FINISHED') {
      playerIndicator.textContent = game.winner;
      playerIndicator.className = `player-indicator ${game.winner === 'X' ? 'player-x' : 'player-o'}`;
      turnText.textContent = `Winner: Player ${game.winner}!`;

      if (game.winReason === 'LINE') {
        const lineNames = game.winningLines.map(l => l.name).join(', ');
        bannerEl.textContent = `🏆 Player ${game.winner} wins by 3-in-a-row (${lineNames})!`;
        bannerEl.className = 'banner winner-line';

        highlightWinningCells(game.winningLines);
        drawWinningLines(game.winningLines);
      } else if (game.winReason === 'CENTER_TIEBREAKER') {
        bannerEl.textContent = `⚡ Cat's Game Tie-Breaker: Player ${game.winner} controls the Center Square Anchor and wins!`;
        bannerEl.className = 'banner winner-tiebreaker';

        const centerCell = getCellElement(1, 1);
        centerCell.classList.add('highlight-center-tiebreak');
      }
    } else {
      playerIndicator.textContent = game.currentTurn;
      playerIndicator.className = `player-indicator ${game.currentTurn === 'X' ? 'player-x' : 'player-o'}`;
      turnText.textContent = `Turn: Player ${game.currentTurn}`;
      bannerEl.style.display = 'none';
      bannerEl.className = 'banner';
    }
  }

  function handleCellClick(r, c) {
    if (game.status === 'FINISHED') return;
    const res = game.makeMove(r, c);
    if (!res.success) return;

    // Update cell DOM
    const cellEl = getCellElement(r, c);
    const mark = game.board[r][c];
    cellEl.textContent = mark;
    cellEl.classList.add('occupied', mark === 'X' ? 'cell-x' : 'cell-o');

    updateStatusDisplay();
  }

  function highlightWinningCells(lines) {
    const winningCoords = new Set();
    lines.forEach(l => {
      l.coords.forEach(([r, c]) => winningCoords.add(`${r},${c}`));
    });

    winningCoords.forEach(coordStr => {
      const [r, c] = coordStr.split(',').map(Number);
      const el = getCellElement(r, c);
      if (el) el.classList.add('highlight-win');
    });
  }

  function drawWinningLines(lines) {
    svgOverlay.innerHTML = '';
    const strokeColor = '#22c55e';
    const strokeWidth = '5';

    lines.forEach(line => {
      const coords = line.coords;
      const p1 = getCellCenter(coords[0][0], coords[0][1]);
      const p3 = getCellCenter(coords[2][0], coords[2][1]);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      path.setAttribute('x1', p1.x);
      path.setAttribute('y1', p1.y);
      path.setAttribute('x2', p3.x);
      path.setAttribute('y2', p3.y);
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', strokeWidth);
      path.setAttribute('stroke-linecap', 'round');
      svgOverlay.appendChild(path);
    });
  }

  function resetGame() {
    game.reset();
    cells.forEach(c => {
      c.textContent = '';
      c.className = 'cell';
      if (parseInt(c.dataset.row) === 1 && parseInt(c.dataset.col) === 1) {
        c.classList.add('center-cell');
      }
    });
    svgOverlay.innerHTML = '';
    updateStatusDisplay();
  }

  resetBtn.addEventListener('click', resetGame);

  // Modal handlers
  rulesBtn.addEventListener('click', () => modalRules.classList.add('open'));
  modalClose.addEventListener('click', () => modalRules.classList.remove('open'));
  modalRules.addEventListener('click', (e) => {
    if (e.target === modalRules) modalRules.classList.remove('open');
  });

  // Initial render
  updateStatusDisplay();
});
