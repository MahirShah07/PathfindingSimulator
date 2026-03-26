function joinPath(path) {
  if (!path || path.length === 0) return 'No path found';
  return path.join(' → ');
}

function getExplanation({ bfsTrials, dfsTrials, allPathTrials, allPaths }) {
  if (allPaths.length === 0) {
    return 'No valid path exists between selected nodes, so all algorithms stop quickly.';
  }

  if (bfsTrials <= allPathTrials) {
    return `BFS is efficient here because it explores level-wise and reached the shortest path with ${bfsTrials} trials vs ${allPathTrials} brute-force trials.`;
  }

  return `Brute force explored ${allPathTrials} node visits to enumerate every path. BFS used ${bfsTrials} and DFS used ${dfsTrials}, so targeted search is still better when you only need one path.`;
}

export function createResultScreen(container, { bindPress, result, onBack, onRestart }) {
  const explanation = getExplanation(result);

  container.innerHTML = `
    <div class="card">
      <h2>Results</h2>
      <div class="results" style="margin-top:12px;">
        <div><strong>Shortest Path (BFS):</strong> ${joinPath(result.bfsPath)}</div>
        <div><strong>DFS Path:</strong> ${joinPath(result.dfsPath)}</div>
        <div><strong>All Paths Count:</strong> ${result.allPaths.length}</div>
        <div><strong>BFS Trials:</strong> ${result.bfsTrials}</div>
        <div><strong>DFS Trials:</strong> ${result.dfsTrials}</div>
        <div><strong>Brute Force Trials:</strong> ${result.allPathTrials}</div>
        <p class="muted">${explanation}</p>
      </div>
      <div class="actions" style="margin-top:12px;">
        <button id="backBtn" type="button">Back to Diagram</button>
        <button id="restartBtn" type="button">Try New Input</button>
      </div>
    </div>
  `;

  bindPress(container.querySelector('#backBtn'), onBack);
  bindPress(container.querySelector('#restartBtn'), onRestart);
}
