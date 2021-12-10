import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

// const fileName = `${__dirname}\\test.txt`;
const fileName = `${__dirname}\\inputs.txt`;

const dataContainer: number[] = [];

let result: number = 0;
let resultTwo: number = 0;

async function loadFile() {
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      dataContainer.push(Number(line.trim()))
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  for (let i = 0; i < dataContainer.length; i++) {
    
    if (i === 0) {
      continue;
    }

    if (dataContainer[i] > dataContainer[i-1]) {
      result = result + 1;
    }


  }

};

async function processPartTwo() {

  for (let i = 0; i < dataContainer.length; i++) {
    
    if (i < 3) {
      continue;
    }

    const groupOneSum = dataContainer[i - 3] + dataContainer[i - 2] + dataContainer[i - 1];
    const groupTwoSum = dataContainer[i - 2] + dataContainer[i - 1] + dataContainer[i];

    if (groupTwoSum > groupOneSum) {
      resultTwo = resultTwo + 1;
    }

  }

};

async function start() {
  console.log('Reading File');
  await loadFile();
  await processPartOne();
  console.log(result);
  await processPartTwo();
  console.log(resultTwo);
};

start();