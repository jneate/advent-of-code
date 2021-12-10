import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

let dataContainer: Array<{ direction: string, quantity: number }> = [];
const position = {
  horizontal: 0,
  depth: 0,
  aim: 0
}

let result: number = 0;
let resultTwo: number = 0;

async function loadFile(fileName: string) {
  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      const splitLine = line.split(' ');
      dataContainer.push({
        direction: splitLine[0],
        quantity: Number(splitLine[1]),
      })
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  for (const move of dataContainer) {
    
    switch (move.direction) {
      case "forward":
        position.horizontal = position.horizontal + move.quantity;
        break;
    
      case "down":
        position.depth = position.depth + move.quantity;
        break;
    
      case "up":
        position.depth = position.depth - move.quantity;
        break;
    
      default:
        break;
    }

  }

  result = position.depth * position.horizontal;

  console.log(result);

};

async function processPartTwo() {

  for (const move of dataContainer) {
    
    switch (move.direction) {
      case "forward":
        position.horizontal = position.horizontal + move.quantity;
        position.depth = position.aim > 0 ? position.depth + (position.aim * move.quantity) : position.depth - (position.aim * move.quantity);
        break;
    
      case "down":
        position.aim = position.aim + move.quantity;
        break;
    
      case "up":
        position.aim = position.aim - move.quantity;
        break;
    
      default:
        break;
    }

  }

  resultTwo = position.depth * position.horizontal;

  console.log(resultTwo);

};
async function resetData(resetFile = false) {
  
  result = 0;
  resultTwo = 0;
  position.depth = 0;
  position.horizontal = 0;
  position.aim = 0;

  if (resetFile) {
    dataContainer = [];
  }

}

async function start() {

  console.log("Test Data");

  await loadFile(`${__dirname}\\test.txt`);
  await processPartOne();
  await resetData();
  await processPartTwo();

  await resetData(true);

  console.log("Input Data");
  
  await loadFile(`${__dirname}\\inputs.txt`);
  await processPartOne();
  await resetData();
  await processPartTwo();

};

start();