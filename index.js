const { day1, day2 } = require('./input.js');
const divide = () => console.log('///////////////////////////////////////');

const runDay1 = () => {
  const chunks = day1.split('\n');
  
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
  console.log('Day 1:', Math.max(...totals))
  
  const tier = [...totals];
  
  const max_1 = Math.max(...tier);
  tier.splice(tier.indexOf(max_1), 1);
  const max_2 = Math.max(...tier);
  tier.splice(tier.indexOf(max_2), 1);
  const max_3 = Math.max(...tier);
  tier.splice(tier.indexOf(max_3), 1);
  
  console.log('Day 1 pt2:', max_1 + max_2 + max_3);
}
const runDay2 = () => {
  const parseDay2 = (input) => {
    return input.split('\n').filter(x => x.length > 0).map(line => {
      return line.split(' ')
    });
  }
  
  const rounds = parseDay2(day2);
  
  const ROCK = 'R';
  const PAPER = 'P';
  const SCISSORS = 'S';
  
  const ELF_ROCK = 'A';
  const ELF_PAPER = 'B';
  const ELF_SCISSORS = 'C';
  
  const HUMAN_ROCK = 'X';
  const HUMAN_PAPER = 'Y';
  const HUMAN_SCISSORS = 'Z';
  
  const valueMap = {
    [ROCK]: 1,
    [PAPER]: 2,
    [SCISSORS]: 3,
  }
  
  const winPlayMap = {
    [ROCK]: PAPER,
    [PAPER]: SCISSORS,
    [SCISSORS]: ROCK,
  }
  
  const losePlayMap = {
    [ROCK]: SCISSORS,
    [PAPER]: ROCK,
    [SCISSORS]: PAPER,
  }
  
  const drawPlayMap = {
    [ROCK]: ROCK,
    [PAPER]: PAPER,
    [SCISSORS]: SCISSORS,
  }
  
  const normalizeMap = {
    [ELF_ROCK]: ROCK,
    [HUMAN_ROCK]: ROCK,
    [ELF_PAPER]: PAPER,
    [HUMAN_PAPER]: PAPER,
    [ELF_SCISSORS]: SCISSORS,
    [HUMAN_SCISSORS]: SCISSORS,
  }
  
  const resultCodeMap = {
    X: 'LOSE',
    Y: 'DRAW',
    Z: 'WIN',
  }
  
  const normalize = (play) => normalizeMap[play];
  
  const getWinningPlay = (play) => winPlayMap[play];
  const getDrawingPlay = (play) => drawPlayMap[play];
  const getLosingPlay = (play) => losePlayMap[play];
  
  const battlePointsFrom = (adversary, you) => {
    if (getWinningPlay(adversary) == you) return [0, 6]; // you won
    if (getDrawingPlay(adversary) == you) return [3, 3]; // you drew
    if (getLosingPlay(adversary) == you) return [6, 0];  // you lost
  }
  
  const score = (round) => {
    const battle_points = battlePointsFrom(round.elf, round.human);
    return {
      elf: valueMap[round.elf] + battle_points[0],
      human: valueMap[round.human] + battle_points[1],
    }
  }
  
  const getDesiredPlay = (play, desired_result_code) => {
    switch(resultCodeMap[desired_result_code]) {
      case 'WIN': return getWinningPlay(play);
      case 'LOSE': return getLosingPlay(play);
      case 'DRAW': return getDrawingPlay(play);
    }
  }
  
  const result = (version) => rounds.reduce((scores, row) => {
    const row_result = score(version ? {
      elf: normalize(row[0]),
      human: normalize(row[1]),
    } : {
      elf: normalize(row[0]),
      human: getDesiredPlay(normalize(row[0]), row[1])
    });
    return {
      elf: scores.elf + row_result.elf,
      human: scores.human + row_result.human
    }
  }, {
    elf: 0,
    human: 0,
  });
  
  console.log("Day 2:", result(true).human);
  console.log("Day 2 pt2:", result(false).human);
}

runDay1();
runDay2();