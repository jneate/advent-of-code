import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

let dataContainer: string[] = [];
let illegalPoints: { [key: string ]: number} = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};
let incompletePoints: { [key: string ]: number} = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
};
let closingChar: { [key: string ]: string} = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

async function loadFile(fileName: string) {

  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      dataContainer.push(line);
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  let result = 0;
  let brokenLines: string[] = [];
  
  for (let line of dataContainer) {

    let stack: string[] = [];

    for (let char of line.split('')) {
      let closing = closingChar[char];
      if (closing) {
        stack[stack.length] = closing;
      } else {
        let expectedClose = stack.pop();
        if (expectedClose && char !== expectedClose) {
          // console.log(`Expected ${expectedClose} found ${char} instead`);
          brokenLines.push(char);
          break;
        }
      }

    }

  }

  result = brokenLines.map(char => illegalPoints[char]).reduce((prev, next) => prev + next);

  console.log(result);

};

async function processPartTwo() {

  let result = 0;
  let fixingLines: string[] = [];
  
  for (let line of dataContainer) {

    let stack: string[] = [];
    
    for (let i = 0; i < line.length; i++) {

      let char = line.charAt(i);
      let closing = closingChar[char];
      if (closing) {
        stack.splice(0,0,closing);
        if (i + 1 === line.length) {
          // Dump the stack
          fixingLines.push(stack.join(''));
        }
      } else {
        // Check if at the end of the line already
        let expectedClose = stack.splice(0,1)[0];
        if (i + 1 === line.length) {
          // Dump the stack
          fixingLines.push(stack.join(''));
        } else {
          if (expectedClose && char !== expectedClose) {
            break;
          }
        }
      }

    }

  }

  let scoreArray: number[] = [];

  scoreArray = fixingLines.map(fix => 
    fix.split('')
      .map(char => incompletePoints[char])
      .reduce((prev, next) => (prev * 5) + next)
  );

  scoreArray.sort(numericSort);

  result = scoreArray[Math.floor(scoreArray.length / 2)];

  console.log(result);

};

function numericSort(a: number, b: number): number {

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;

}

async function resetData() {
  
  dataContainer = [];

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