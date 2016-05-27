import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Pac from '../../models/pac';
import SharedStuff from '../../mixins/shared-stuff';

const {
  on,
  get,
  computed,
  run,
  set,
  Component
} = Ember;

export default Component.extend(KeyboardShortcuts, SharedStuff, {
  level: 0,
  score: 0,

  isMoving: false,

  width: computed.oneWay('grid.firstObject.length'),
  height: computed.oneWay('grid.length'),

  isLevelComplete() {
    return !get(this, 'grid').any((row) => row.any((cell) => cell === 2));
  },

  onDinInsertElement: on('didInsertElement', function() {
    const squareSize = get(this, 'squareSize');
    this.$('canvas').attr('width', get(this, 'width') * squareSize);
    this.$('canvas').attr('height', get(this, 'height') * squareSize);
    set(this, 'pac', Pac.create({}));
    this.movementLoop();
  }),

  restartLevel() {
    set(this, 'pac.x', 0);
    set(this, 'pac.y', 0);

    const grid = get(this, 'grid');
    grid.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => (cell === 0) && (grid[rowIndex][columnIndex] = 2))
    );
  },

  collidedWithBorder() {
    const x = get(this, 'pac.x');
    const y = get(this, 'pac.y');
    return (x < 0 || y < 0 || x >= get(this, 'width') || y >= get(this, 'height'));
  },

  collidedWithWall() {
    let x = get(this, 'pac.x');
    let y = get(this, 'pac.y');
    return get(this, 'grid')[y][x] === 1;
  },

  clearScreen() {
    const squareSize = get(this, 'squareSize');
    get(this, 'ctx').clearRect(0, 0, get(this, 'width') * squareSize, get(this, 'height') * squareSize);
  },

  processAnyPellets() {
    let x = get(this, 'pac.x');
    let y = get(this, 'pac.y');
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

  drawPellet(x, y) {
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor, 'stopped');
  },

  movementLoop(){
    if (get(this, 'frameCycle') === get(this, 'framesPerMovement')) {
      let direction = get(this, 'pac.direction');
      set(this, 'pac.x', this.nextCoordinate('x', direction));
      set(this, 'pac.y', this.nextCoordinate('y', direction));

      set(this, 'frameCycle', 1);
      this.processAnyPellets();
      this.changePacDirection();
    } else if (get(this, 'pac.direction') === 'stopped') {
      this.changePacDirection();
    } else {
      this.incrementProperty('frameCycle');
    }

    this.clearScreen();
    this.drawGrid();
    this.drawPac();

    run.later(this, this.movementLoop, 1000 / 60);
  },

  drawPac() {
    return get(this, 'pac').draw();
  },

  nextCoordinate(coordinate, direction) {
    return get(this, 'pac').nextCoordinate(coordinate, direction);
  },

  changePacDirection() {
    return get(this, 'pac').changeDirection();
  },

  movePacMan(direction) {
    let inputBlocked = get(this, 'isMoving') || this.pathBlockedInDirection(direction);
    if (!inputBlocked) {
      set(this, 'pac.direction', direction);
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

  keyboardShortcuts: {
    up() {
      set(this, 'pac.intent', 'up');
    },
    down() {
      set(this, 'pac.intent', 'down');
    },
    left() {
      set(this, 'pac.intent', 'left');
    },
    right() {
      set(this, 'pac.intent', 'right');
    }
  }
});
