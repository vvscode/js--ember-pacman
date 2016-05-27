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
});
