import Ember from 'ember';

const {
  get,
  computed,
  $
} = Ember;

export default Ember.Mixin.create({
  frameCycle: 1,
  framesPerMovement: 60,

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

  drawCircle(x, y, radiusDivisor, direction, color = '#000') {
    let ctx = get(this, 'ctx');
    let squareSize = get(this, 'level.squareSize');

    let pixelX = (x + 1 / 2 + this.offsetFor('x', direction)) * squareSize;
    let pixelY = (y + 1 / 2 + this.offsetFor('y', direction)) * squareSize;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, squareSize / radiusDivisor, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  },

  ctx: computed(function() {
    const canvas = $('canvas')[0]; // sad, that it become global
    return canvas.getContext('2d');
  }),

  offsetFor(coordinate, direction) {
    let frameRatio = get(this, 'frameCycle') / get(this, 'framesPerMovement');
    return get(this, `directions.${direction}.${coordinate}`) * frameRatio;
  }
});
