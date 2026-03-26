import { computeLayout } from '../utils/graph.js';

function line(x1, y1, x2, y2, className = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${className}" stroke="#89a2ff" stroke-width="2" />`;
}

export function createDiagramScreen(container, { bindPress, nodes, edges, onBack, onRun }) {
  const layout = computeLayout(nodes, edges);
  const edgeLines = edges.map(([from, to]) => {
    const a = layout[from];
    const b = layout[to];
    return line(a.x, a.y, b.x, b.y);
  }).join('');

  container.innerHTML = `
    <div class="card">
      <h2>Hasse Diagram</h2>
      <p class="muted">Tap two nodes to select start and end.</p>
      <div id="selectionText" class="badge" style="margin-top:8px;">Start: - | End: -</div>
      <div class="diagram-wrap" style="margin-top:12px;">
        <svg class="diagram-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${edgeLines}
          <g id="pathLayer"></g>
        </svg>
        <div class="node-layer" id="nodeLayer"></div>
      </div>
      <div class="actions" style="margin-top:12px;">
        <button id="backBtn" type="button">Back</button>
        <button id="runBtn" type="button">Run Pathfinding</button>
      </div>
    </div>
  `;

  const nodeLayer = container.querySelector('#nodeLayer');
  const pathLayer = container.querySelector('#pathLayer');
  const selectionText = container.querySelector('#selectionText');
  const selected = { start: null, end: null };
  const nodeElements = new Map();

  const updateSelection = () => {
    selectionText.textContent = `Start: ${selected.start ?? '-'} | End: ${selected.end ?? '-'}`;
    nodeElements.forEach((element, key) => {
      element.classList.toggle('selected', key === selected.start || key === selected.end);
    });

    pathLayer.innerHTML = '';
    if (selected.start && selected.end) {
      const a = layout[selected.start];
      const b = layout[selected.end];
      pathLayer.innerHTML = line(a.x, a.y, b.x, b.y, 'path-anim');
    }
  };

  for (const node of nodes) {
    const { x, y } = layout[node];
    const button = document.createElement('button');
    button.className = 'node';
    button.type = 'button';
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.textContent = String(node);

    bindPress(button, () => {
      if (!selected.start || (selected.start && selected.end)) {
        selected.start = node;
        selected.end = null;
      } else if (node !== selected.start) {
        selected.end = node;
      }
      updateSelection();
    });

    nodeLayer.appendChild(button);
    nodeElements.set(node, button);
  }

  bindPress(container.querySelector('#backBtn'), onBack);
  bindPress(container.querySelector('#runBtn'), () => {
    if (!selected.start || !selected.end) {
      window.alert('Please select a start node and an end node.');
      return;
    }

    onRun({ start: selected.start, end: selected.end });
  });

  updateSelection();
}
