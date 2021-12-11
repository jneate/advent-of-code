import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

let bingoOutputContainer: number[] = [];
let gridContainer: Array<number[][]> = [];
let gridSize = 5;

async function loadFile(fileName: string) {

  let counter = 0;
  let tempArray: Array<number[]> = [];

  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      if (line.indexOf(",") !== -1) {
        const splitLine = line.split(',');
        splitLine.forEach(num => bingoOutputContainer.push(Number(num)));
      } else {
        if (line.length > 0) {
          const splitLine = line.split(' ');
          let tempArrayX: number[] = [];
          splitLine.forEach(gridNumber => {
            const trimmedNumber = gridNumber.trim();
            if (trimmedNumber.length > 0) {
              tempArrayX.push(Number(trimmedNumber));
            }
          });
          counter = counter + 1;
          if (counter === gridSize) {
            tempArray.push(tempArrayX);
            gridContainer.push(tempArray);
            counter = 0;
            // Really useful for this task
            // console.table(tempArray);
            tempArray = [];
          } else {
            tempArray.push(tempArrayX);
          }
        }
      }
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  let result = 0;

  let bingo = false;
  let bingoCard;
  let magicBingoNumber = 0;
  const sumReducer = (previousValue: number, currentValue: number) => previousValue + currentValue;

  for (let bingoNumber of bingoOutputContainer) {

    if (bingo) {
      break;
    }
    
    for (let grid of gridContainer) {

      if (bingo) {
        break;
      }

      for (let i = 0; i < gridSize; i++) {

        if (bingo) {
          break;
        }

        let jCounter = 0;

        for (let j = 0; j < gridSize; j++) {

          if (grid[i][j] === bingoNumber) {
            grid[i][j] = -1;
          }

          jCounter = jCounter + grid[j][i];

        }

        if (grid[i].reduce(sumReducer) === (gridSize * -1) || jCounter === (gridSize * -1)) {
          bingo = true;
          bingoCard = grid;
          magicBingoNumber = bingoNumber;
          break;
        }

      }

    }

  }

  // Concat the 2D array into one long one
  if (!bingoCard) {
    console.log("Unlucky, try again next time");
  } else {
    let remainingNumbers = bingoCard?.reduce((previousValue: number[], currentValue: number[]) => previousValue.concat(currentValue)).filter(num => num !== -1);
    result = remainingNumbers.reduce(sumReducer) * magicBingoNumber;
    console.log(result);
  }


};

async function processPartTwo() {

  // Logic is very similar for part two - Just handle the loop breaks differently

  let result = 0;

  let bingo = false;
  let bingoCard;
  let magicBingoNumber = 0;
  let allBingos: Map<number, boolean> = new Map();
  const sumReducer = (previousValue: number, currentValue: number) => previousValue + currentValue;

  for (let bingoNumber of bingoOutputContainer) {
    
    for (let card = 0; card < gridContainer.length; card++) {

      let grid = gridContainer[card];

      if (allBingos.has(card)) {
        continue;
      }

      for (let i = 0; i < gridSize; i++) {

        let jCounter = 0;

        for (let j = 0; j < gridSize; j++) {

          if (grid[i][j] === bingoNumber) {
            grid[i][j] = -1;
          }

          jCounter = jCounter + grid[j][i];

        }

        if (grid[i].reduce(sumReducer) === (gridSize * -1) || jCounter === (gridSize * -1)) {
          allBingos.set(card, true);
          bingoCard = grid;
          magicBingoNumber = bingoNumber;
          break;
        }

      }

    }

    if (allBingos.size === gridContainer.length) {
      break;
    }

  }
  
  // Concat the 2D array into one long one
  if (!bingoCard) {
    console.log("Unlucky, try again next time");
  } else {
    let remainingNumbers = bingoCard?.reduce((previousValue: number[], currentValue: number[]) => previousValue.concat(currentValue)).filter(num => num !== -1);
    result = remainingNumbers.reduce(sumReducer) * magicBingoNumber;
    console.log(result);
  }

};

async function resetData() {
  
  bingoOutputContainer = [];
  gridContainer = [];

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