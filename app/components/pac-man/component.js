import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

const {
  on,
  get,
  computed
} = Ember;

export default Ember.Component.extend(KeyboardShortcuts, {
  level: 0,
  score: 0,
  x: 1,
  y: 2,
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
    this.drawPacman();
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

  movePacMan(direction, amount) {
    this.incrementProperty(direction, amount);
    if (this.collidedWithBorder() || this.collidedWithWall()) {
      this.decrementProperty(direction, amount);
    }
    this.processAnyPellets();

    this.clearScreen();
    this.drawGrid();
    this.drawPacman();
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

  drawPallet(x, y) {
    const squareSize = this.get('squareSize');
    let pixelX = (x + 1 / 2) * squareSize;
    let pixelY = (y + 1 / 2) * squareSize;
    this.drawCircle(pixelX, pixelY, squareSize / 6, '#a0a');
  },

  drawGrid() {
    get(this, 'grid')
      .forEach((row, rowIndex) =>
        row.forEach((cell, columnIndex) => {
          if (cell === 1) {
            this.drawWall(columnIndex, rowIndex);
          } else if (cell === 2) {
            this.drawPallet(columnIndex, rowIndex);
          }
        })
      );
  },

  drawCircle(x, y, radius, color = '#fff') {
    const ctx = this.get('ctx');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  drawPacman() {
    const squareSize = get(this, 'squareSize');
    const pixelX = (get(this, 'x') + 1 / 2) * squareSize;
    const pixelY = (get(this, 'y') + 1 / 2) * squareSize;
    this.drawCircle(pixelX, pixelY, squareSize / 2, '#000');
  },

  keyboardShortcuts: {
    up() {
      this.movePacMan('y', -1);
    },
    down() {
      this.movePacMan('y', 1);
    },
    left() {
      this.movePacMan('x', -1);
    },
    right() {
      this.movePacMan('x', 1);
    },
  },
});
