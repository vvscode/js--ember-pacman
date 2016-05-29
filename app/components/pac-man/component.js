import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';
import Pac from '../../models/pac';
import Ghost from '../../models/ghost';
import Level from '../../models/level';
import Level2 from '../../models/level2';
import SharedStuff from '../../mixins/shared-stuff';

const LEVELS = {
  0: Level2,
  1: Level
};

const {
  on,
  get,
  run,
  set,
  Component
} = Ember;

export default Component.extend(KeyboardShortcuts, SharedStuff, {
  levelNumber: 0,
  score: 0,

  isMoving: false,

  isLevelComplete() {
    return get(this, 'level').isComplete();
  },

  updateCanvas() {
    const squareSize = get(this, 'level.squareSize');
    this.$('canvas').attr('width', get(this, 'level.width') * squareSize);
    this.$('canvas').attr('height', get(this, 'level.height') * squareSize);
  },

  onDinInsertElement: on('didInsertElement', function() {
    set(this, 'level', LEVELS[0].create({}));
    set(this, 'pac', Pac.create({
      level: get(this, 'level'),
      x: get(this, 'level.startingPac.x'),
      y: get(this, 'level.startingPac.y')
    }));
    set(this, 'ghost', Ghost.create({
      level: get(this, 'level'),
      x: 4,
      y: 0,
      pac: get(this, 'pac')
    }));

    this.updateCanvas();
    this.movementLoop();
  }),

  restart(){
    const Level = LEVELS[get(this, 'levelNumber') % Object.keys(LEVELS).length];
    const level = Level.create({});
    set(this, 'level', level);
    set(this, 'pac.level', level);
    this.updateCanvas();
    get(this, 'pac').restart();
    get(this, 'level').restart();
  },

  collidedWithBorder() {
    const x = get(this, 'pac.x');
    const y = get(this, 'pac.y');
    return (x < 0 || y < 0 || x >= get(this, 'level.width') || y >= get(this, 'level.height'));
  },

  collidedWithWall() {
    let x = get(this, 'pac.x');
    let y = get(this, 'pac.y');
    return get(this, 'level.grid')[y][x] === 1;
  },

  clearScreen() {
    const squareSize = get(this, 'level.squareSize');
    get(this, 'ctx').clearRect(0, 0, get(this, 'level.width') * squareSize, get(this, 'level.height') * squareSize);
  },

  processAnyPellets() {
    let x = get(this, 'pac.x');
    let y = get(this, 'pac.y');
    let grid = get(this, 'level.grid');

    if (grid[y][x] === 2) {
      grid[y][x] = 0;
      this.incrementProperty('score');
      if (this.isLevelComplete()) {
        this.incrementProperty('levelNumber');
        this.restart();
      }
    }
  },

  drawPellet(x, y) {
    let radiusDivisor = 6;
    this.drawCircle(x, y, radiusDivisor, 'stopped');
  },

  movementLoop(){
    get(this, 'pac').move();
    get(this, 'ghost').move();
    this.processAnyPellets();
    this.clearScreen();
    this.drawGrid();
    get(this, 'pac').draw();
    get(this, 'ghost').draw();
    run.later(this, this.movementLoop, 500 / 60);
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
    const squareSize = get(this, 'level.squareSize');
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
    get(this, 'level.grid')
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
