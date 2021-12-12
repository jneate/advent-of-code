import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

let dataContainer: Array<{ input: string, output: string }> = new Array<{ input: string, output: string }>();

let displayMap = {
  zero: ['a','b','c','e','f','g'],
  one: ['c','f'],
  two: ['a','c','d','e','g'],
  three: ['a','c','d','f','g'],
  four: ['b','c','d','f'],
  five: ['a','b','d','f','g'],
  six: ['a','b','d','e','f','g'],
  seven: ['a','c','f'],
  eight: ['a','b','c','d','e','f','g'],
  nine: ['a','b','c','d','f','g']
};

let numberMap: {[key: string]: number} = {
  'abcefg': 0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9
};

async function loadFile(fileName: string) {

  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      let splitLine = line.split(' | ');
      dataContainer.push({
        input: splitLine[0],
        output: splitLine[1]
      });
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  // Took me a while to even understand the puzzle here but hey ho

  let result = 0;
  
  for (let problem of dataContainer) {

    let outputArray = problem.output.split(' ');
    outputArray.forEach(number => {
      if (number.length === displayMap.one.length || 
        number.length === displayMap.four.length || 
        number.length === displayMap.seven.length || 
        number.length === displayMap.eight.length) {
          result = result + 1;
      }
    });

  }

  console.log(result);

};

async function processPartTwo() {

  // Sat here scratching my head for a while trying to decide a solution.
  let result = 0;
  
  for (let problem of dataContainer) {

    let inputArray = problem.input.split(' ');
    let outputArray = problem.output.split(' ');

    let one = "";
    let four = "";
    let seven = "";
    let eight = "";

    let charMap: { [key: string]: string[] } = {};
    let invertedCharMap: { [key: string]: string } = {};
    let inputMap: { [key: string]: number } = {};

    inputArray.forEach(number => {

      for (let char of number) {
        inputMap[char] = inputMap[char] ? inputMap[char] + 1 : 1;
      }

      if (number.length === displayMap.eight.length) {
        eight = number;
      } else if (number.length === displayMap.one.length) {
        one = number;
      } else if (number.length === displayMap.four.length) {
        four = number
      } else if (number.length === displayMap.seven.length) {
        seven = number;
      } 

    });

    // It took me way too long to figure out these deductions of the numbers, after many failed attempts of wire mappings

    // Position A - one is inside seven, with one difference being position a
    charMap['a'] = seven.split('').filter(char => !one.split('').includes(char));
    // Position B - b is the only one that occurs in 6 numbers so find all chars that appear 6 times only
    charMap['b'] = Object.keys(inputMap).filter(key => inputMap[key] === 6);
    // Position C - c occurs 8 times along with a, but we already have A so find counts equal to 8 apart from A
    charMap['c'] = Object.keys(inputMap).filter(key => inputMap[key] === 8).filter(char => char !== charMap['a'].join(''));
    // Position D - Number 4 is the only one with 4 chars, it also contains bcdf and also the number 1 (cf)
    // This makes D = 4chars (bcdf) - 1chars (cf) = bd, since we know B from 2 lines ago, that leaves us with the value for D
    charMap['d'] = four.split('').filter(char => !one.split('').includes(char)).filter(char => char !== charMap['b'].join(''));
    // Position E - e is the only one that occurs in 4 numbers so find all chars that appear 4 times only
    charMap['e'] = Object.keys(inputMap).filter(key => inputMap[key] === 4);
    // Position F - f is the only one that occurs in 9 numbers so find all chars that appear 9 times only
    charMap['f'] = Object.keys(inputMap).filter(key => inputMap[key] === 9);
    // Position G - g occurs 7 times along with d, but we already have D so find counts equal to 7 apart from D
    charMap['g'] = Object.keys(inputMap).filter(key => inputMap[key] === 7).filter(char => char !== charMap['d'].join(''));

    // Invert the map to make reverse processing easier
    for (let key in charMap) {
      invertedCharMap[charMap[key][0]] = key;
    }

    let totalOutput = "";

    outputArray.forEach(number => {
      let realNumString = "";
      number.split('').forEach(char => realNumString = realNumString + invertedCharMap[char]);
      realNumString = realNumString.split('').sort().join('');
      totalOutput = totalOutput.concat(String(numberMap[realNumString]));
    });

    result = result + Number(totalOutput);

  }

  console.log(result);

};

async function resetData() {
  
  dataContainer = new Array<{ input: string, output: string }>();

}

async function start() {

  console.log("Test Data");

  await loadFile(`${__dirname}\\test.txt`);
  let time = Date.now();
  await processPartOne();
  console.log(`Part One - Time Taken: ${Date.now() - time}ms`);
  time = Date.now();
  await processPartTwo();
  console.log(`Part Two - Time Taken: ${Date.now() - time}ms`);

  await resetData();

  console.log("Input Data");
  
  await loadFile(`${__dirname}\\inputs.txt`);
  time = Date.now();
  await processPartOne();
  console.log(`Part One - Time Taken: ${Date.now() - time}ms`);
  time = Date.now();
  await processPartTwo();
  console.log(`Part Two - Time Taken: ${Date.now() - time}ms`);

};

start();