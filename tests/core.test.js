import test from 'node:test';
import assert from 'node:assert/strict';

import { parseSetInput, parseRelationInput, buildAdjacency } from '../utils/graph.js';
import { validatePoset } from '../math/poset.js';
import { transitiveReduction } from '../math/hasse.js';
import { bfsShortestPath } from '../algorithms/bfs.js';
import { dfsPath } from '../algorithms/dfs.js';
import { findAllPaths } from '../algorithms/allPaths.js';

test('guide test case builds expected hasse and path', () => {
  const nodes = parseSetInput('{1,2,3}');
  const edges = parseRelationInput('{(1,1),(2,2),(3,3),(1,2),(2,3),(1,3)}');

  const poset = validatePoset(nodes, edges);
  assert.equal(poset.valid, true);

  const hasse = transitiveReduction(nodes, edges);
  assert.deepEqual(hasse, [
    ['1', '2'],
    ['2', '3']
  ]);

  const graph = buildAdjacency(nodes, hasse);
  const bfs = bfsShortestPath(graph, '1', '3');
  const dfs = dfsPath(graph, '1', '3');
  const all = findAllPaths(graph, '1', '3');

  assert.deepEqual(bfs.path, ['1', '2', '3']);
  assert.deepEqual(dfs.path, ['1', '2', '3']);
  assert.equal(all.paths.length, 1);
  assert.deepEqual(all.paths[0], ['1', '2', '3']);
  assert.ok(bfs.trials >= 1);
  assert.ok(dfs.trials >= 1);
  assert.ok(all.trials >= 1);
});
