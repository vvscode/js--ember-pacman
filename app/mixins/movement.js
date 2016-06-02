import Ember from 'ember';

const {
  Mixin,
  set,
  get,
  isEmpty
} = Ember;

export default Mixin.create({
  x: null,
  y: null,
  level: null,
  direction: 'down',
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
    let direction = get(this, 'direction');
    set(this, 'x', this.nextCoordinate('x', direction));
    set(this, 'y', this.nextCoordinate('y', direction));

    set(this, 'frameCycle', 1);
  },
  pathBlockedInDirection(direction) {
    let cellTypeInDirection = this.cellTypeInDirection(direction);
    return isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
  },
  cellTypeInDirection(direction) {
    let nextX = this.nextCoordinate('x', direction);
    let nextY = this.nextCoordinate('y', direction);
    return get(this, `level.grid.${nextY}.${nextX}`);
  },
  nextCoordinate(coordinate, direction){
    let next = get(this, coordinate) + get(this, `directions.${direction}.${coordinate}`);
    if (get(this, 'level.teleport')) {
      if (direction === 'up' || direction === 'down') {
        return this.modulo(next, get(this, 'level.height'));
      } else {
        return this.modulo(next, get(this, 'level.width'));
      }
    } else {
      return next;
    }
  },
  modulo(num, mod) {
    return ((num + mod) % mod);
  }
});
