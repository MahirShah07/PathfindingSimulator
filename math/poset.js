function relationSet(edges) {
  return new Set(edges.map(([a, b]) => `${a}|${b}`));
}

export function validatePoset(nodes, edges) {
  const rel = relationSet(edges);

  for (const node of nodes) {
    if (!rel.has(`${node}|${node}`)) {
      return { valid: false, failedRule: 'reflexive' };
    }
  }

  for (const [a, b] of edges) {
    if (a !== b && rel.has(`${b}|${a}`)) {
      return { valid: false, failedRule: 'antisymmetric' };
    }
  }

  for (const [a, b] of edges) {
    for (const [c, d] of edges) {
      if (b === c && !rel.has(`${a}|${d}`)) {
        return { valid: false, failedRule: 'transitive' };
      }
    }
  }

  return { valid: true, failedRule: null };
}
