const { day1, day2, day3, day4, day5, day6 } = require('./input.js');
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
    switch (resultCodeMap[desired_result_code]) {
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
const runDay3 = () => {
  const input = day3.split('\n').filter(x => x.length > 0);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetUppercase = alphabet.toLocaleUpperCase();
  const valueLookup = alphabet + alphabetUppercase;

  const getValueOfChar = (c) => valueLookup.indexOf(c) + 1;

  const getCharInBothHalves = (line) => {
    const firstHalf = line.substring(0, line.length / 2);
    const secondHalf = line.substring(line.length / 2);
    const intersection = firstHalf.split('').filter(x => {
      return secondHalf.indexOf(x) > -1;
    })[0];
    return intersection;
  }

  const sum_of_values = input
    .map(x => getValueOfChar(getCharInBothHalves(x)))
    .reduce((a, b) => a + b, 0);

  console.log(sum_of_values);

  const badges = [];
  let current_bundle = [];
  for (let j = 0; j < input.length; ++j) {
    current_bundle.push(input[j]);
    if (current_bundle.length === 3) {
      const intersection = current_bundle.join('').split('').filter(x => {
        return current_bundle[0].indexOf(x) > -1
          && current_bundle[1].indexOf(x) > -1
          && current_bundle[2].indexOf(x) > -1;
      })[0];
      badges.push(intersection);
      current_bundle = []
    }
  }

  const sum_of_badges = badges
    .map(x => getValueOfChar(x))
    .reduce((a, b) => a + b, 0);

  console.log(sum_of_badges)
}
const runDay4 = () => {
  const input = day4.split('\n').filter(x => x.length > 0);

  const isContained = (pair, largerPair) => {
    return pair[0] >= largerPair[0] && pair[1] <= largerPair[1];
  }

  const overlaps = (pair, otherPair) => {
    return pair[0] <= otherPair[0] && pair[1] >= otherPair[0];
  }

  const pairs = input.map(line => {
    return line.split(',').map(elf_assignment => {
      return elf_assignment.split('-').map(x => parseInt(x));
    });
  });

  const number_contained = pairs.map(pair => {
    return isContained(pair[0], pair[1]) || isContained(pair[1], pair[0]);
  }).filter(x => x).length;

  const number_overlapped = pairs.map(pair => {
    return overlaps(pair[0], pair[1]) || overlaps(pair[1], pair[0]);
  }).filter(x => x).length;

  console.log(number_contained);
  console.log(number_overlapped);
}
const runDay5 = () => {
  const start_of_instructions = day5.split('\n').findIndex(x => x.indexOf('move') > -1);
  const instructions = day5.split('\n').slice(start_of_instructions);

  const columns = [];
  const stack_txt = day5.substring(0, day5.indexOf(instructions[0]));
  const stack_txt_lines = stack_txt.split('\n').filter(x => x.length > 0);
  const stack_txt_lines_data = stack_txt_lines.slice(0, stack_txt_lines.length - 1)
  const stack_txt_line_column_names = stack_txt_lines[stack_txt_lines.length - 1];
  const no_columns = stack_txt_line_column_names.split('')
    .filter(x => x.indexOf(' ') === -1).length;

  for (let k = stack_txt_lines_data.length - 1; k >= 0; --k) {
    // work backwards through each line
    const line = stack_txt_lines_data[k];
    // now work through each column
    for (let j = 0; j < no_columns; ++j) {
      const value = line[stack_txt_line_column_names.indexOf(j + 1)];
      if (value !== ' ') {
        if (columns[j]) columns[j].push(value);
        else columns[j] = [value];
      }
    }
  }

  // now work through the instructions
  for (let k = 0; k < instructions.length; ++k) {
    const instr_data = instructions[k].split(' ');
    const number_to_move = parseInt(instr_data[1]);
    const move_from = parseInt(instr_data[3]) - 1;
    const move_to = parseInt(instr_data[5]) - 1;

    // OG moving method
    // for (let j = 0; j < number_to_move; ++j) {
    //   let value = columns[move_from].pop();
    //   columns[move_to].push(value);
    // }

    // 9001 method
    const crates_moving = columns[move_from]
      .slice(columns[move_from].length - number_to_move)
    const crates_staying = columns[move_from]
      .slice(0, columns[move_from].length - number_to_move);
    columns[move_from] = crates_staying;
    columns[move_to] = columns[move_to].concat(crates_moving);
  }

  const top_crates = columns.map(x => x[x.length - 1]).join('');
  console.log(top_crates)
}
const runDay6 = () => {
  const input = day6;
  const NUM_UNIQUE = 14;
  
  const allUniqueChars = (str) => str.split('')
    .filter((x, i, a) => a.indexOf(x) === i).length === str.length;
  
  let marker_is_at = 0;
  for (let j = NUM_UNIQUE; j < input.length; ++j) {
    const substr = input.substring(j - NUM_UNIQUE, j);
    if (allUniqueChars(substr)) {
      marker_is_at = j;
      break;
    }
  }
  
  console.log(marker_is_at);
}

// runDay1();
// runDay2();
// runDay3();
// runDay4();
// runDay5();
runDay6();