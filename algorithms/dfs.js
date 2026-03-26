export function dfsPath(graph, start, end) {
  const stack = [[start, [start]]];
  let trials = 0;

  while (stack.length > 0) {
    const [node, path] = stack.pop();
    trials += 1;

    if (node === end) {
      return { path, trials };
    }

    const neighbors = graph[node] || [];
    for (let i = neighbors.length - 1; i >= 0; i -= 1) {
      const next = neighbors[i];
      if (!path.includes(next)) {
        stack.push([next, [...path, next]]);
      }
    }
  }

  return { path: [], trials };
}
