import { createLoadingScreen } from './screens/loading.js';
import { createMenuScreen } from './screens/menu.js';
import { createInputScreen } from './screens/input.js';
import { createDiagramScreen } from './screens/diagram.js';
import { createResultScreen } from './screens/result.js';
import { parseSetInput, parseRelationInput, buildAdjacency } from './utils/graph.js';
import { validatePoset } from './math/poset.js';
import { transitiveReduction } from './math/hasse.js';
import { bfsShortestPath } from './algorithms/bfs.js';
import { dfsPath } from './algorithms/dfs.js';
import { findAllPaths } from './algorithms/allPaths.js';

const state = {
  nodes: [],
  edges: [],
  hasseEdges: [],
  adjacency: {},
  selection: { start: null, end: null },
  result: null
};

const screens = {
  loading: document.getElementById('loadingScreen'),
  menu: document.getElementById('menuScreen'),
  input: document.getElementById('inputScreen'),
  diagram: document.getElementById('diagramScreen'),
  result: document.getElementById('resultScreen')
};

function showScreen(id) {
  Object.values(screens).forEach((element) => element.classList.remove('active'));
  screens[id].classList.add('active');
}

const touchBound = new WeakSet();
function bindPress(element, handler) {
  if (!element || touchBound.has(element)) return;
  let touched = false;
  element.addEventListener('touchstart', (event) => {
    touched = true;
    event.preventDefault();
    element.classList.add('button-press');
    handler();
    setTimeout(() => element.classList.remove('button-press'), 120);
  }, { passive: false });

  element.addEventListener('click', () => {
    if (touched) {
      touched = false;
      return;
    }
    handler();
  });

  touchBound.add(element);
}

createLoadingScreen(screens.loading, () => showScreen('menu'));

createMenuScreen(screens.menu, {
  bindPress,
  onStart: () => showScreen('input')
});

createInputScreen(screens.input, {
  bindPress,
  onBack: () => showScreen('menu'),
  onSubmit: ({ setText, relationText, feedback }) => {
    try {
      const nodes = parseSetInput(setText);
      const edges = parseRelationInput(relationText);
      const poset = validatePoset(nodes, edges);

      if (!poset.valid) {
        feedback(`Invalid poset: ${poset.failedRule}.`, true);
        return;
      }

      const hasseEdges = transitiveReduction(nodes, edges);
      state.nodes = nodes;
      state.edges = edges;
      state.hasseEdges = hasseEdges;
      state.adjacency = buildAdjacency(nodes, hasseEdges);
      state.selection = { start: null, end: null };
      state.result = null;

      feedback('Valid poset! Hasse diagram generated.', false);
      createDiagramScreen(screens.diagram, {
        bindPress,
        nodes: state.nodes,
        edges: state.hasseEdges,
        onBack: () => showScreen('input'),
        onRun: ({ start, end }) => {
          const allPathsResult = findAllPaths(state.adjacency, start, end);
          const bfsResult = bfsShortestPath(state.adjacency, start, end);
          const dfsResult = dfsPath(state.adjacency, start, end);

          state.result = {
            start,
            end,
            allPaths: allPathsResult.paths,
            allPathTrials: allPathsResult.trials,
            bfsPath: bfsResult.path,
            bfsTrials: bfsResult.trials,
            dfsPath: dfsResult.path,
            dfsTrials: dfsResult.trials
          };

          createResultScreen(screens.result, {
            bindPress,
            result: state.result,
            onBack: () => showScreen('diagram'),
            onRestart: () => showScreen('input')
          });

          showScreen('result');
        }
      });

      showScreen('diagram');
    } catch (error) {
      feedback(error.message || 'Failed to parse input.', true);
    }
  }
});
