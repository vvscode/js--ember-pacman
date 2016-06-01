import Ember from 'ember';

const {
  Object: EmObject,
  computed,
  get
} = Ember;

export default EmObject.extend({
  startingPac: {
    x: 0,
    y: 0
  },
  ghostsStartings: [
    { x: 4, y: 0},
    { x: 1, y: 5}
  ],
  // 0 is a blank space
  // 1 is a wall
  // 2 is a pellet
  grid: [
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 1, 2, 1, 2, 2, 2, 1],
    [2, 2, 1, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1]
  ],

  squareSize: 40,
  width: computed.alias('grid.firstObject.length'),
  height: computed.alias('grid.length'),
  pixelWidth: computed(function() {
    return get(this, 'width') * get(this, 'squareSize');
  }),
  pixelHeight: computed(function() {
    return get(this, 'height') * get(this, 'squareSize');
  }),
  isComplete() {
    let hasPelletsLeft = false;

    get(this, 'grid').forEach((row)=> row.forEach((cell)=> ((cell === 2) && (hasPelletsLeft = true))));
    return !hasPelletsLeft;
  },

  restart(){
    const grid = get(this, 'grid');
    grid
      .forEach((row, rowIndex)=>
        row
          .forEach((cell, columnIndex)=> ((cell === 0) && (grid[rowIndex][columnIndex] = 2)))
      );
  }
});
