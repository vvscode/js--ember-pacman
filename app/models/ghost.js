import Ember from 'ember';
import SharedStuff from '../mixins/shared-stuff';
import Movement from '../mixins/movement';

const {
  get
} = Ember;

export default Ember.Object.extend(SharedStuff, Movement, {
  direction: 'right',
  draw() {
    let x = get(this, 'x');
    let y = get(this, 'y');
    let radiusDivisor = 2;
    this.drawCircle(x, y, radiusDivisor, get(this, 'direction'), '#aaa');
  },
  changeDirection(){
    const directions = ['left', 'right', 'up', 'down']
    let directionWeights = directions.map((direction)=>this.chanceOfPacmanIfInDirection(direction))

    let bestDirection = this.getRandomItem(directions, directionWeights);
    this.set('direction', bestDirection);
  },

  chanceOfPacmanIfInDirection(direction) {
    if (this.pathBlockedInDirection(direction)) {
      return 0;
    }
    let chances = ((get(this, 'pac.y') - get(this, 'y')) * get(this, `directions.${direction}.y`)) +
      ((get(this, 'pac.x') - get(this, 'x')) * get(this, `directions.${direction}.x`));
    return Math.max(chances, 0) + 0.2;
  },

  getRandomItem(list, weight) {
    const total_weight = weight.reduce(function(prev, cur, i, arr) {
      return prev + cur;
    });

    const random_num = Math.random() * total_weight;
    let weight_sum = 0;

    for (let i = 0; i < list.length; i++) {
      weight_sum += weight[i];
      weight_sum = Number(weight_sum.toFixed(2));

      if (random_num < weight_sum) {
        return list[i];
      }
    }
  },
});
