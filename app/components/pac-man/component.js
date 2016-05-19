import Ember from 'ember';

const {
  on
} = Ember;

export default Ember.Component.extend({
  onDinInsertElement: on('didInsertElement', function() {
    this.drawCircle();
  }),

  drawCircle() {
    const canvas = this.$('canvas')[0];
    const ctx = canvas.getContext('2d');
    const x = 50;
    const y = 100;
    const radius = 20;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
  }
});
