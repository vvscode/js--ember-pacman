import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';

const {
  get,
  set,
  isEmpty
} = Ember;

export default Ember.Object.extend(SharedStuff, {
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
  },

  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },

  nextCoordinate(coordinate, direction) {
    return get(this, coordinate) + get(this, `directions.${direction}.${coordinate}`);
  },

  move(){
    if (this.animationCompleted()) {
      this.finalizeMove();
      this.changeDirection();
    }
    else if (get(this, 'direction') === 'stopped') {
      this.changeDirection();
    } else {
      this.incrementProperty('frameCycle');
    }
  },
  animationCompleted(){
    return get(this, 'frameCycle') === get(this, 'framesPerMovement');
  },
  finalizeMove(){
    let direction = this.get('direction');
    set(this, 'x', this.nextCoordinate('x', direction));
    set(this, 'y', this.nextCoordinate('y', direction));

    set(this, 'frameCycle', 1);
  }
});
