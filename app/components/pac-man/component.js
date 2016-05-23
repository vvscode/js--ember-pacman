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
  direction: 'stopped',
  width: computed('grid', function() {
    return get(this, 'grid.firstObject.length');
  }),
  height: computed('grid', function() {
    return get(this, 'grid.length');
  }),
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
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
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

    this.drawGrid();
    this.drawPac();
  }),

  restartLevel() {
    this.set('x', 0);
    this.set('y', 0);

    const grid = this.get('grid');
    grid.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => (cell === 0) && (grid[rowIndex][columnIndex] = 2))
    );
  },

  collidedWithBorder() {
    const x = this.get('x');
    const y = this.get('y');
    return (x < 0 || y < 0 || x >= this.get('width') || y >= this.get('height'));
  },

  collidedWithWall() {
    let x = this.get('x');
    let y = this.get('y');
    return get(this, 'grid')[y][x] === 1;
  },

  clearScreen() {
    const squareSize = get(this, 'squareSize');
    get(this, 'ctx').clearRect(0, 0, get(this, 'width') * squareSize, get(this, 'height') * squareSize);
  },

  processAnyPellets() {
    let x = this.get('x');
    let y = this.get('y');
    let grid = this.get('grid');

    if (grid[y][x] == 2) {
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

  movementLoop() {
    if (this.get('frameCycle') == this.get('framesPerMovement')) {
      let direction = this.get('direction')
      set(this, 'x', this.nextCoordinate('x', direction));
      set(this, 'y', this.nextCoordinate('y', direction));
      set(this, 'isMoving', false);
      set(this, 'frameCycle', 1);

      this.processAnyPellets();
    } else {
      this.incrementProperty('frameCycle');
      run.later(this, this.movementLoop, 1000 / 60);
    }

    this.clearScreen();
    this.drawGrid();
    this.drawPac();
  },

  movePacMan(direction) {
    let inputBlocked = this.get('isMoving') || this.pathBlockedInDirection(direction)
    if (!inputBlocked) {
      this.set('direction', direction)
      this.set('isMoving', true)
      this.movementLoop()
    }
  },

  drawWall(x, y) {
    const squareSize = this.get('squareSize');
    const ctx = this.get('ctx');
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
    let ctx = get(this, 'ctx')
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
      this.movePacMan('up');
    },
    down() {
      this.movePacMan('down');
    },
    left() {
      this.movePacMan('left');
    },
    right() {
      this.movePacMan('right');
    },
  },
});
