const { day1, day2 } = require('./input.js')

const chunks = day1.split('\n');
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

console.log('Day 1 pt2:', max_1 + max_2 + max_3);

/// Day 2
console.log('//////////////////////////////////////////////////////')

const parseDay2 = (input) => {
  return input.split('\n').filter(x => x.length > 0).map(line => {
    return line.split(' ')
  });
}

const rounds = parseDay2(day2);

const HUMAN_ROCK = 'X';
const HUMAN_PAPER = 'Y';
const HUMAN_SCISSORS = 'Z';

const isRock = (play) => play == 'A' || play == 'X';
const isPaper = (play) => play == 'B' || play == 'Y';
const isScissors = (play) => play == 'C' || play == 'Z';

const valueOfPlay = (play) => {
  if (isRock(play)) {
    return 1; // Rock
  } else if (isPaper(play)) {
    return 2; // Paper
  } else if (isScissors(play)) {
    return 3; // Scissors
  }
}

const getYourPlay = (elf_play, desired_result) => {
  if (isRock(elf_play)) {
    if (desired_result == 'X') {
      return HUMAN_SCISSORS; // lose
    } else if (desired_result == 'Y') {
      return HUMAN_ROCK; // draw
    } else if (desired_result == 'Z') {
      return HUMAN_PAPER; // win
    }
  } else if (isPaper(elf_play)) {
    if (desired_result == 'X') {
      return HUMAN_ROCK; // lose
    } else if (desired_result == 'Y') {
      return HUMAN_PAPER; // draw
    } else if (desired_result == 'Z') {
      return HUMAN_SCISSORS; // win
    }
  } else if (isScissors(elf_play)) {
    if (desired_result == 'X') {
      return HUMAN_PAPER; // lose
    } else if (desired_result == 'Y') {
      return HUMAN_SCISSORS; // draw
    } else if (desired_result == 'Z') {
      return HUMAN_ROCK; // win
    }
  }
}

const battlePointsFrom = (round) => {
  const elf_play = round[0];
  const your_play = round[1];
  
  if (isRock(your_play) && isRock(elf_play)) return [3, 3];
  if (isRock(your_play) && isPaper(elf_play)) return [6, 0];
  if (isRock(your_play) && isScissors(elf_play)) return [0, 6];
  
  if (isPaper(your_play) && isRock(elf_play)) return [0, 6];
  if (isPaper(your_play) && isPaper(elf_play)) return [3, 3];
  if (isPaper(your_play) && isScissors(elf_play)) return [6, 0];
  
  if (isScissors(your_play) && isRock(elf_play)) return [6, 0];
  if (isScissors(your_play) && isPaper(elf_play)) return [0, 6];
  if (isScissors(your_play) && isScissors(elf_play)) return [3, 3];

  return [3, 3]; // should never happen though
}

const score = (round, withV2Understanding = false) => {
  if (withV2Understanding) {
    round = [round[0], getYourPlay(round[0], round[1])];
  }
  
  const elf_play_score = valueOfPlay(round[0]);
  const your_play_score = valueOfPlay(round[1]);
  const points = battlePointsFrom(round);
  return [elf_play_score + points[0], your_play_score + points[1]];
}

const result = rounds.reduce((scores, round) => {
  const _score = score(round, true);
  return [scores[0] + _score[0], scores[1] + _score[1]]
}, [0, 0]);

console.log(result)