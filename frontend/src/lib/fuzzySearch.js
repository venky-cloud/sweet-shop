function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Tolerates typos and near-matches: exact substrings match immediately,
// otherwise any word in the text within a small edit distance of any
// word in the query counts as a match (distance budget grows with word length).
export function fuzzyMatch(query, text) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const t = text.toLowerCase();
  if (t.includes(q)) return true;

  const queryWords = q.split(/\s+/);
  const textWords = t.split(/\s+/);
  return queryWords.some((qw) =>
    textWords.some((tw) => {
      if (tw.includes(qw) || qw.includes(tw)) return true;
      const budget = qw.length <= 4 ? 1 : qw.length <= 7 ? 2 : 3;
      return levenshtein(qw, tw) <= budget;
    })
  );
}

export function fuzzyMatchProduct(query, product) {
  const q = query.trim();
  if (!q) return true;
  const fields = [product.name, product.category, ...(product.ingredients || [])];
  return fields.some((field) => fuzzyMatch(q, field));
}
