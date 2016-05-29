import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

const {
  get,
  set
} = Ember;

export default Ember.Object.extend(SharedStuff, Movement, {
  direction: 'down',
  intent: 'down',
  x: 1,
  y: 2,

  draw() {
    let x = get(this, 'x');
    let y = get(this, 'y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, get(this, 'direction'));
  },

  restart(){
    set(this, 'x', get(this, 'level.startingPac.x'));
    set(this, 'y', get(this, 'level.startingPac.y'));
    set(this, 'frameCycle', 0);
    set(this, 'direction', 'stopped');
  },

  changeDirection(){
    let intent = get(this, 'intent');
    if (this.pathBlockedInDirection(intent)) {
      set(this, 'direction', 'stopped');
    } else {
      set(this, 'direction', intent);
    }
  }
});
