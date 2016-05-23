import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

const {
  on,
  get,
  computed,
  isEmpty,
  run,
  set
} = Ember;

export default Ember.Component.extend(KeyboardShortcuts, {
  level: 0,
  score: 0,
  x: 1,
  y: 2,
  frameCycle: 1,
  framesPerMovement: 15,
  isMoving: false,
  direction: 'down',
  intent: 'down',
  width: computed.oneWay('grid.firstObject.length'),
  height: computed.oneWay('grid.length'),
  squareSize: 20,
  grid: [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1]
  ],

  ctx: computed(function() {
    const canvas = this.$('canvas')[0];
    return canvas.getContext('2d');
  }),

  isLevelComplete() {
    return !get(this, 'grid').any((row) => row.any((cell) => cell === 2));
  },

  onDinInsertElement: on('didInsertElement', function() {
    const squareSize = get(this, 'squareSize');
    this.$('canvas').attr('width', get(this, 'width') * squareSize);
    this.$('canvas').attr('height', get(this, 'height') * squareSize);

    this.movementLoop();
  }),

  restartLevel() {
    set(this, 'x', 0);
    set(this, 'y', 0);

    const grid = get(this, 'grid');
    grid.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => (cell === 0) && (grid[rowIndex][columnIndex] = 2))
    );
  },

  collidedWithBorder() {
    const x = get(this, 'x');
    const y = get(this, 'y');
    return (x < 0 || y < 0 || x >= get(this, 'width') || y >= get(this, 'height'));
  },

  collidedWithWall() {
    let x = get(this, 'x');
    let y = get(this, 'y');
    return get(this, 'grid')[y][x] === 1;
  },

  clearScreen() {
    const squareSize = get(this, 'squareSize');
    get(this, 'ctx').clearRect(0, 0, get(this, 'width') * squareSize, get(this, 'height') * squareSize);
  },

  processAnyPellets() {
    let x = get(this, 'x');
    let y = get(this, 'y');
    let grid = get(this, 'grid');

    if (grid[y][x] === 2) {
      grid[y][x] = 0;
      this.incrementProperty('score');
      if (this.isLevelComplete()) {
        this.incrementProperty('level');
        this.restartLevel();
      }
    }
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);
    return get(this, `grid.${nextY}.${nextX}`);
  },

  nextCoordinate(coordinate, direction) {
    return get(this, coordinate) + get(this, `directions.${direction}.${coordinate}`);
  },

  drawPac() {
    let x = get(this, 'x');
    let y = get(this, 'y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, get(this, 'direction'));
  },

  drawPellet(x, y) {
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor, 'stopped');
  },

  changePacDirection(){
    let intent = get(this, 'intent');
    if (this.pathBlockedInDirection(intent)) {
      set(this, 'direction', 'stopped');
    } else {
      set(this, 'direction', intent);
    }
  },

  movementLoop(){
    if (get(this, 'frameCycle') === get(this, 'framesPerMovement')) {
      let direction = get(this, 'direction');
      set(this, 'x', this.nextCoordinate('x', direction));
      set(this, 'y', this.nextCoordinate('y', direction));

      set(this, 'frameCycle', 1);
      this.processAnyPellets();
      this.changePacDirection();
    } else if (get(this, 'direction') === 'stopped') {
      this.changePacDirection();
    } else {
      this.incrementProperty('frameCycle');
    }

    this.clearScreen();
    this.drawGrid();
    this.drawPac();

    run.later(this, this.movementLoop, 1000 / 60);
  },


  movePacMan(direction) {
    let inputBlocked = get(this, 'isMoving') || this.pathBlockedInDirection(direction);
    if (!inputBlocked) {
      set(this, 'direction', direction);
      set(this, 'isMoving', true);
      this.movementLoop();
    }
  },

  drawWall(x, y) {
    const squareSize = get(this, 'squareSize');
    const ctx = get(this, 'ctx');
    ctx.fillStyle = '#ded';
    ctx.fillRect(
      x * squareSize,
      y * squareSize,
      squareSize,
      squareSize
    );
  },

  drawGrid() {
    get(this, 'grid')
      .forEach((row, rowIndex) =>
        row.forEach((cell, columnIndex) => {
          if (cell === 1) {
            this.drawWall(columnIndex, rowIndex);
          } else if (cell === 2) {
            this.drawPellet(columnIndex, rowIndex);
          }
        })
      );
  },

  offsetFor(coordinate, direction) {
    let frameRatio = get(this, 'frameCycle') / get(this, 'framesPerMovement');
    return get(this, `directions.${direction}.${coordinate}`) * frameRatio;
  },

  drawCircle(x, y, radiusDivisor, direction, color = '#000') {
    let ctx = get(this, 'ctx');
    let squareSize = get(this, 'squareSize');

    let pixelX = (x + 1 / 2 + this.offsetFor('x', direction)) * squareSize;
    let pixelY = (y + 1 / 2 + this.offsetFor('y', direction)) * squareSize;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize / radiusDivisor, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  directions: {
    'up': {
      x: 0,
      y: -1
    },
    'down': {
      x: 0,
      y: 1
    },
    'left': {
      x: -1,
      y: 0
    },
    'right': {
      x: 1,
      y: 0
    },
    'stopped': {
      x: 0,
      y: 0
    }
  },

  keyboardShortcuts: {
    up() {
      set(this, 'intent', 'up');
    },
    down() {
      set(this, 'intent', 'down');
    },
    left() {
      set(this, 'intent', 'left');
    },
    right() {
      set(this, 'intent', 'right');
    }
  }
});
