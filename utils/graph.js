function normalize(raw) {
  return raw.replace(/\s+/g, '');
}

export function parseSetInput(input) {
  const text = normalize(input);
  const match = text.match(/^\{(.*)\}$/);
  if (!match) {
    throw new Error('Set must use braces, for example {1,2,3}.');
  }

  if (match[1] === '') {
    throw new Error('Set cannot be empty.');
  }

  const values = [...new Set(match[1].split(',').filter(Boolean))];
  if (values.length === 0) {
    throw new Error('Set must include at least one node.');
  }

  return values;
}

export function parseRelationInput(input) {
  const text = normalize(input);
  const match = text.match(/^\{(.*)\}$/);
  if (!match) {
    throw new Error('Relation must use braces, for example {(1,2),(2,3)}.');
  }

  const body = match[1];
  if (!body) {
    return [];
  }

  const pairs = [...body.matchAll(/\(([^,]+),([^\)]+)\)/g)].map((m) => [m[1], m[2]]);
  if (pairs.length === 0) {
    throw new Error('Could not parse relation pairs.');
  }

  return pairs;
}

export function buildAdjacency(nodes, edges) {
  const graph = Object.fromEntries(nodes.map((node) => [node, []]));
  for (const [from, to] of edges) {
    if (graph[from]) {
      graph[from].push(to);
    }
  }
  return graph;
}

export function computeLayout(nodes, edges) {
  const incoming = Object.fromEntries(nodes.map((n) => [n, 0]));
  const outgoing = Object.fromEntries(nodes.map((n) => [n, []]));

  for (const [a, b] of edges) {
    if (outgoing[a]) {
      outgoing[a].push(b);
      incoming[b] += 1;
    }
  }

  const level = Object.fromEntries(nodes.map((n) => [n, 0]));
  const queue = nodes.filter((n) => incoming[n] === 0);
  while (queue.length) {
    const node = queue.shift();
    for (const next of outgoing[node]) {
      level[next] = Math.max(level[next], level[node] + 1);
      incoming[next] -= 1;
      if (incoming[next] === 0) queue.push(next);
    }
  }

  const groups = {};
  for (const node of nodes) {
    const key = level[node];
    groups[key] = groups[key] || [];
    groups[key].push(node);
  }

  const levels = Object.keys(groups).map(Number).sort((a, b) => a - b);
  const maxLevel = Math.max(0, ...levels);
  const pos = {};

  levels.forEach((lvl) => {
    const row = groups[lvl];
    const y = 90 - (lvl / (maxLevel || 1)) * 80;
    row.forEach((node, idx) => {
      const x = ((idx + 1) / (row.length + 1)) * 90 + 5;
      pos[node] = { x, y };
    });
  });

  return pos;
}
