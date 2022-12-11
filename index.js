const { day1, day2, day3, day4, day5, day6, day7 } = require('./input.js');

const runDay = (n) => global["runDay" + n]();
const runToday = () => runDay((new Date()).getDate());
const divide = () => console.log('///////////////////////////////////////');

global.runDay1 = () => {
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
global.runDay2 = () => {
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
global.runDay3 = () => {
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
global.runDay4 = () => {
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
global.runDay5 = () => {
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
global.runDay6 = () => {
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
global.runDay7 = () => {
  const real_input = day7;
  const sec_input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

  const parseSecondInput = (walk) => {
    const STATE = {
      reading: 0,
      moving: 1,
      listing: 2
    }
    
    const getStateOfLine = (line) => {
      if (line.startsWith('$')) {
        if (line.substring(2, 4) === 'cd') return STATE.moving;
        if (line.substring(2, 4) === 'ls') return STATE.listing;
      }
      return STATE.reading;
    }

    const movePlace = (place, line) => {
      const where = line.substring(5);
      if (where === '..') {
        return place.slice(0, place.length - 1);
      } else {
        place.push(where);
        return place;
      }
    }
    
    const addChild = (store, place, child) => {
      let property = store;
      for (let j = 0; j < place.length; ++j) {
        property.size += child.size;
        property = property.children.find(child => child.name == place[j]);
      }
      property.size += child.size;
      property.children.push(child);
      return store;
    }

    const readEntry = (line) => {
      line = line.split(' ');
      return {
        name: line[1],
        type: line[0] === 'dir' ? 'dir' : 'file',
        size: line[0] === 'dir' ? null : parseInt(line[0]),
        children: []
      }
    }
    
    let place = [];
    let store = {
      name: '/',
      type: 'dir',
      size: null,
      children: []
    }
    const lines = walk.split('\n');
    
    for (line of lines.slice(1)) {
      const state = getStateOfLine(line);
      if (state === STATE.moving) {
        place = movePlace(place, line);
      } else if (state === STATE.listing) {
        // no action needed atm
      } else if (state === STATE.reading) {
        store = addChild(store, place, readEntry(line));
      }
    }
    
    return store;
  }
  
  const input = `- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)`;
  
  const input_lines = input.split('\n');

  const parseLine = (line) => {
    const name = line.substring(line.indexOf('-') + 2, line.lastIndexOf('(') - 1);
    const type = line.substring(
      line.lastIndexOf('(') +  1,
      line.lastIndexOf(',') !== -1 ? line.lastIndexOf(',') : line.lastIndexOf(')')
    );
    const size = parseInt(line.substring(line.lastIndexOf('=') + 1, line.lastIndexOf(')')));
    return {
      name,
      type,
      size
    }
  }

  const parseSubtree = (lines) => {
    const parsed = {
      ...parseLine(lines.shift()),
      children: []
    }
    
    if (lines.length === 0) return parsed;
    
    const sibling_line_indexes = lines
      .map((x, i) => x.indexOf('-') == lines[0].indexOf('-') ? i : -1)
      .filter(x => x !== -1);
    
    while (sibling_line_indexes.length > 0) {
      const children_lines = sibling_line_indexes.length == 1
        ? lines.slice(sibling_line_indexes[0])
        : lines.slice(sibling_line_indexes[0], sibling_line_indexes[1]);
      
      parsed.children.push({
        ...parseLine(lines[sibling_line_indexes.shift()]),
        children: parseSubtree(children_lines).children
      });
    }
    return parsed;
  }
  
  const getSize = (x) => x.size ?? x;
  const applySizeOfDirectory = (dir) => {
    if (dir.type !== 'dir') return dir.size; // it's a file, so it has a size :)
    dir.size = dir.children.reduce((a, b) => a + getSize(applySizeOfDirectory(b)), 0);
    return dir;
  }

  // const parsed = applySizeOfDirectory(parseSubtree(input_lines));
  // const parsed = parseSecondInput(sec_input);
  const parsed = parseSecondInput(day7);

  const getAllDirectories = (dir) => dir.type === 'dir'
      ? [dir, ...dir.children.map(child => getAllDirectories(child)).flat()]
      : [];

  const all_directories = getAllDirectories(parsed);
  // const without_children = all_directories.map(dir => ({...dir, children: null}));
  // console.log(JSON.stringify(all_directories, null, 2));

  const answer = all_directories.filter(x => x.size <= 100000).reduce((a, b) => a + b.size, 0);
  console.log(answer);

  
}

runDay(7);
// runToday();