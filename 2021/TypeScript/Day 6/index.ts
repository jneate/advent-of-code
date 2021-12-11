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

  let fishArray = dataContainer.slice();
  let newFish = [];
  let days = 80;

  for (let i = 1; i <= days; i++) {

    for (let j = 0; j < fishArray.length; j++) {

      let fish = fishArray[j];

      if (fish === 0) {
        fishArray[j] = 6;
        newFish.push(8);
      } else {
        fishArray[j] = fish - 1;
      }

    }

    fishArray = fishArray.concat(newFish);
    newFish = [];

  }

  console.log(fishArray.length);

};

async function processPartTwo() {

  // Part one works for a small enough data set but eventually max array size is reached so can't brute force part two
  // Actually thinking about it, there's no reason to process ALL of the fish one by one because they can only be 0-8 meaning I can group the fish together

  let days = 256;
  let totalFish = 0;
  let fishMap: { [key: number]: number } = {};

  for (let fish of dataContainer) {

    // Load fish input days into groups that count the number of fish on that day
    fishMap[fish] = fishMap[fish] ? fishMap[fish] + 1 : 1;
    
  }

  for (let i = 1; i <= days; i++) {

    let tempObj: { [key: number]: number } = {};

    for (let fishLife in fishMap) {
      if (Number(fishLife) === 0) {
        let zeroFish = fishMap[fishLife];
        // Generate new day 8s
        tempObj[8] = zeroFish;
        // Current day 0s become day 6s
        tempObj[6] = zeroFish;
        // tempObj[6] = fishMap[fishLife] + (fishMap[7] ?? 0);
      } else if (Number(fishLife) === 7) {
        // Add day 7s to new day 6 counts
        tempObj[6] = fishMap[fishLife] + (tempObj[6] ?? 0);
      } else {
        // Shift fish day by -1
        tempObj[Number(fishLife) - 1] = fishMap[fishLife]
      }
    }

    fishMap = tempObj;
    
  }

  totalFish = Object.values(fishMap).reduce((prev: number, current: number) => prev + current);

  console.log(totalFish);

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