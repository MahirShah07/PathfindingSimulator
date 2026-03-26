function edgeSet(edges) {
  return new Set(edges.map(([a, b]) => `${a}|${b}`));
}

function hasAlternativePath(from, to, adjacency, skipKey) {
  const visited = new Set([from]);
  const queue = [from];

  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of adjacency[node] || []) {
      const key = `${node}|${next}`;
      if (key === skipKey) {
        continue;
      }
      if (next === to) {
        return true;
      }
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return false;
}

export function transitiveReduction(nodes, edges) {
  const nonReflexive = edges.filter(([a, b]) => a !== b);
  const adjacency = Object.fromEntries(nodes.map((node) => [node, []]));
  for (const [a, b] of nonReflexive) {
    adjacency[a].push(b);
  }

  const unique = [...edgeSet(nonReflexive)].map((key) => key.split('|'));
  return unique
    .filter(([a, b]) => !hasAlternativePath(a, b, adjacency, `${a}|${b}`))
    .map(([a, b]) => [a, b]);
}
