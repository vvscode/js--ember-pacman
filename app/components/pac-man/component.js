import Ember from 'ember';
import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/component';

const {
  on,
  get
} = Ember;

export default Ember.Component.extend(KeyboardShortcuts, {
  x: 50,
  y: 100,
  squareSize: 20,

  onDinInsertElement: on('didInsertElement', function() {
    this.drawCircle();
  }),

  clearScreen() {
    const canvas = this.$('canvas')[0];
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    ctx.clearRect(0, 0, width, height);
  },

  drawCircle() {
    const canvas = this.$('canvas')[0];
    const ctx = canvas.getContext('2d');
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
    up: function() {
      this.incrementProperty('y', -1 * this.get('squareSize'));
      this.clearScreen();
      this.drawCircle();
    },
    down: function() {
      this.incrementProperty('y', this.get('squareSize'));
      this.clearScreen();
      this.drawCircle();
    },
    left: function() {
      this.incrementProperty('x', -1 * this.get('squareSize'));
      this.clearScreen();
      this.drawCircle();
    },
    right: function() {
      this.incrementProperty('x', this.get('squareSize'));
      this.clearScreen();
      this.drawCircle();
    },
  },
});
