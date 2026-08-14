export const seededShuffle = (array, seed) => {
  const result = [...array];
  let m = result.length,
    t,
    i;
  let currentSeed =
    typeof seed === 'string'
      ? seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
      : seed || 0;
  const rand = (s) => {
    const x = Math.sin(s) * 1e4;
    return x - Math.floor(x);
  };
  while (m) {
    i = Math.floor(rand(currentSeed + m) * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
};
