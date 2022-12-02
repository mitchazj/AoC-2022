const { input } = require('./input.js')

const chunks = input.split('\n');
console.log('No inputs:', chunks.length)

let totals = [];
let current_total = 0;
while (chunks.length > 0) {
  const line = chunks.pop();
  if (line.length > 0) {
    const value = parseInt(line);
    current_total += value;
  } else {
    totals.push(current_total);
    current_total = 0;
  }
}

console.log('No elves:', totals.length)
console.log('Day 1:', Math.max(...totals))

const tier = [...totals];

const max_1 = Math.max(...tier);
tier.splice(tier.indexOf(max_1), 1);
const max_2 = Math.max(...tier);
tier.splice(tier.indexOf(max_2), 1);
const max_3 = Math.max(...tier);
tier.splice(tier.indexOf(max_3), 1);

console.log('Day 2:', max_1 + max_2 + max_3);