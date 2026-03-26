export function findAllPaths(graph, start, end) {
  const all = [];
  let trials = 0;

  function walk(node, path) {
    trials += 1;
    const nextPath = [...path, node];

    if (node === end) {
      all.push(nextPath);
      return;
    }

    for (const next of graph[node] || []) {
      if (!nextPath.includes(next)) {
        walk(next, nextPath);
      }
    }
  }

  walk(start, []);
  return { paths: all, trials };
}
