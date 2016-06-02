import Level from './level';

export default Level.extend({
  startingPac: { x: 1, y: 1 },
  ghostsStartings: [
    { x: 0, y: 5}
  ],
  squareSize: 60,
  grid: [
    [1, 2, 1, 1, 1, 2, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 2, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 1, 1, 1, 2, 2, 2],
    [2, 1, 2, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 2, 1, 2, 1, 1, 2],
    [1, 2, 1, 1, 1, 2, 1, 1, 1]
  ],
  teleport: true
});
