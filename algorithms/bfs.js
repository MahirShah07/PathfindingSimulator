export function bfsShortestPath(graph, start, end) {
  const queue = [[start]];
  const visited = new Set();
  let trials = 0;

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    trials += 1;

    if (node === end) {
      return { path, trials };
    }

    if (visited.has(node)) {
      continue;
    }

    visited.add(node);
    for (const next of graph[node] || []) {
      if (!path.includes(next)) {
        queue.push([...path, next]);
      }
    }
  }

  return { path: [], trials };
}
