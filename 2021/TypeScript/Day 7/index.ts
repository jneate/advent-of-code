import events from 'events';
import fs from 'fs';
import { tmpdir } from 'os';
import * as readline from 'readline';

let dataContainer: number[] = [];

async function loadFile(fileName: string) {

  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      dataContainer = line.split(',').map(splitLine => Number(splitLine));
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  let crabPositions = dataContainer.slice();
  let maxPosition = 0;
  let minPosition = 0;
  
  for (let crab of crabPositions) {
    maxPosition = maxPosition > crab ? maxPosition : crab;
  }

  let fuelCost = maxPosition * crabPositions.length;
  
  for (let i = minPosition; i <= maxPosition; i++) {
    // Could cache the value of i - next to save re-calculating if needed
    let newCost = crabPositions.reduce((previous: number, next: number) => previous + (Math.abs(i - next)), 0);
    if (newCost < fuelCost) {
      fuelCost = newCost;
    }

  }

  console.log(fuelCost);

};

async function processPartTwo() {

  let crabPositions = dataContainer.slice();
  let maxPosition = 0;
  let minPosition =  Number.MAX_SAFE_INTEGER;;
  let fuelMoveCache: { [key: number]: number} = {};
  let fuelCost = Number.MAX_SAFE_INTEGER;
  
  for (let crab of crabPositions) {
    maxPosition = maxPosition > crab ? maxPosition : crab;
    minPosition = minPosition < crab ? minPosition : crab;
  }

  let counter = 0;

  for (let i = minPosition; i <= maxPosition; i++) {
    let newCost = crabPositions.reduce((previous: number, next: number) => {
      let distance = Math.abs(i - next);
      if (fuelMoveCache[distance]) {
        // Cache the distance calculation to slightly speedup processing
        return previous + fuelMoveCache[distance];
      } else {
        let cost = 0;
        for (let j = 1; j <= distance; j++) {
          cost = cost + j;
        }
        fuelMoveCache[distance] = cost;
        return previous + cost;
      }
    }, 0);
    if (newCost < fuelCost) {
      fuelCost = newCost;
    }

  }

  console.log(fuelCost);

};

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