import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

const {
  on,
  get,
  computed
} = Ember;

export default Ember.Component.extend(KeyboardShortcuts, {
  x: 50,
  y: 100,
  width: 800,
  height: 600,
  squareSize: 20,

  ctx: computed(function() {
    const canvas = this.$('canvas')[0];
    return canvas.getContext('2d');
  }),

  onDinInsertElement: on('didInsertElement', function() {
    this.drawCircle();
  }),

  clearScreen() {
    get(this, 'ctx').clearRect(0, 0, get(this, 'width'), get(this, 'height'));
  },

  movePacMan(direction, amount) {
    this.incrementProperty(direction, amount);
    this.clearScreen();
    this.drawCircle();
  },

  drawCircle() {
    const ctx = get(this, 'ctx');
    const x = get(this, 'x');
    const y = get(this, 'y');
    const radius = get(this, 'squareSize') / 2;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  keyboardShortcuts: {
    up() {
      this.movePacMan('y', -1 * this.get('squareSize'));
    },
    down() {
      this.movePacMan('y', this.get('squareSize'));
    },
    left() {
      this.movePacMan('x', -1 * this.get('squareSize'));
    },
    right() {
      this.movePacMan('x', this.get('squareSize'));
    },
  },
});
