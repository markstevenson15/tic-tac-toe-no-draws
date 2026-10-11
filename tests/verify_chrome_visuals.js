/**
 * Headless Chrome E2E visual verification script
 * Renders winning states and takes visual screenshots
 */

const fs = require('fs');
const { execSync } = require('child_process');

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 1. Create a simulated state for Line Win
function generateStateHtml(moves, filename) {
  const html = fs.readFileSync('index.html', 'utf8');
  const simulationSnippet = `
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      const moves = ${JSON.stringify(moves)};
      moves.forEach(([r, c]) => {
        const cell = document.querySelector(\`[data-row="\${r}"][data-col="\${c}"]\`);
        if (cell) cell.click();
      });
    });
  </script>
  `;
  const injected = html.replace('</body>', simulationSnippet + '</body>');
  fs.writeFileSync('test_sim.html', injected);

  execSync(`"${CHROME_PATH}" --headless=new --screenshot=${filename} --window-size=600,850 test_sim.html`);
  fs.unlinkSync('test_sim.html');
  console.log(`Generated ${filename}`);
}

// Win by Line: Top Row (0,0), (1,0), (0,1), (1,1), (0,2)
generateStateHtml([[0,0], [1,0], [0,1], [1,1], [0,2]], 'screenshot_line_win.png');

// Win by Tiebreaker: Cat's Game where O holds center (1,1)
// 1.X(0,0), 2.O(1,1), 3.X(0,2), 4.O(0,1), 5.X(2,1), 6.O(1,2), 7.X(1,0), 8.O(2,0), 9.X(2,2)
generateStateHtml([[0,0], [1,1], [0,2], [0,1], [2,1], [1,2], [1,0], [2,0], [2,2]], 'screenshot_tiebreaker_win.png');
