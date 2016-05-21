import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

const {
  on,
  get,
  computed
} = Ember;

export default Ember.Component.extend(KeyboardShortcuts, {
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  ],

  ctx: computed(function() {
    const canvas = this.$('canvas')[0];
    return canvas.getContext('2d');
  }),

  onDinInsertElement: on('didInsertElement', function() {
    const squareSize = get(this, 'squareSize');
    this.$('canvas').attr('width', get(this, 'width') * squareSize);
    this.$('canvas').attr('height', get(this, 'height') * squareSize);

    this.drawWalls();
    this.drawCircle();
  }),

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

  movePacMan(direction, amount) {
    this.incrementProperty(direction, amount);
    if (this.collidedWithBorder() || this.collidedWithWall()) {
      this.decrementProperty(direction, amount);
    }
    this.clearScreen();
    this.drawWalls();
    this.drawCircle();
  },

  drawWalls() {
    const squareSize = this.get('squareSize');
    const ctx = this.get('ctx');
    ctx.fillStyle = '#ded';

    get(this, 'grid')
      .forEach((row, rowIndex) =>
                row.forEach((cell, columnIndex) => cell === 1 && ctx.fillRect(
                  columnIndex * squareSize,
                  rowIndex * squareSize,
                  squareSize,
                  squareSize
                )
              )
            );
  },

  drawCircle() {
    const ctx = get(this, 'ctx');
    const squareSize = get(this, 'squareSize');
    const pixelX = (get(this, 'x') + 1 / 2) * squareSize;
    const pixelY = (get(this, 'y') + 1 / 2) * squareSize;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize / 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
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
