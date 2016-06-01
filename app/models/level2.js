import Level from './level';

export default Level.extend({
  startingPac: {
    x: 0,
    y: 0
  },
  ghostsStartings: [
    { x: 4, y: 0},
    { x: 0, y: 6}
  ],
  squareSize: 60,
  grid: [
    [2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 2, 1, 2, 1, 1, 2],
    [2, 1, 2, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 1, 1, 1, 2, 2, 2],
    [2, 1, 2, 2, 2, 2, 2, 1, 2],
    [2, 1, 1, 2, 1, 2, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2]
  ]
});
