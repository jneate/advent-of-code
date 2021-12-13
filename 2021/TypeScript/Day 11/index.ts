import { notDeepStrictEqual } from 'assert';
import events from 'events';
import fs from 'fs';
import { setUncaughtExceptionCaptureCallback, uptime } from 'process';
import * as readline from 'readline';

let dataContainer: Array<string[]> = [];

async function loadFile(fileName: string) {

  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      dataContainer.push(line.split(''));
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  let result = 0;
  let octopi: any[] = [];
  
  for (let y = 0; y < dataContainer.length; y++) {

    octopi[y] = octopi[y] ?? [];
    octopi[y+1] = octopi[y+1] ?? [];

    for (let x = 0; x < dataContainer[y].length; x++) {

      let octopus: { [key: string]: any } = {};

      octopus.value = Number(dataContainer[y][x]);

      if (y > 0) {
        octopus.upNum = Number(dataContainer[y-1][x]);
        octopus.up = octopi[y-1][x];
      }

      if (x > 0) {
        octopus.leftNum = Number(dataContainer[y][x-1]);
        octopus.left = octopi[y][x-1];
      }

      if (y !== dataContainer.length - 1) {
        octopus.downNum = Number(dataContainer[y+1][x]);
        octopus.down = octopi[y+1][x];
      }

      if (x !== dataContainer[y].length - 1) {
        octopus.rightNum = Number(dataContainer[y][x+1]);
        octopus.right = octopi[y][x+1];
      }
      
      // Top Left
      if (y > 0 && x > 0) {
        octopus.topLeftNum = Number(dataContainer[y-1][x-1]);
        octopus.topLeft = octopi[y-1][x-1];
      }

      // Top Right
      if (y > 0 && x !== dataContainer[y].length - 1) {
        octopus.topRightNum = Number(dataContainer[y-1][x+1]);
        octopus.topRight = octopi[y-1][x+1];
      }

      // Bottom Left
      if (y !== dataContainer.length - 1 && x > 0) {
        octopus.bottomLeftNum = Number(dataContainer[y+1][x-1]);
        octopus.bottomLeft = octopi[y+1][x-1];
      }

      // Bottom Right
      if (y !== dataContainer.length - 1 && x !== dataContainer[y].length - 1) {
        octopus.bottomRightNum = Number(dataContainer[y+1][x+1]);
        octopus.bottomRight = octopi[y+1][x+1];
      }

      octopi[y][x] = octopus;

      if (octopus.up) {
        if (!octopi[y-1][x]) {
          octopi[y-1][x] = {
            value: octopus.up
          }
        }
        octopi[y-1][x].down = octopus;
      }

      if (octopus.left) {
        if (!octopi[y][x-1]) {
          octopi[y][x-1] = {
            value: octopus.left
          }
        }
        octopi[y][x-1].right = octopus;
      }

      if (octopus.down) {
        if (!octopi[y+1][x]) {
          octopi[y+1][x] = {
            value: octopus.down
          }
        }
        octopi[y+1][x].up = octopus;
      }

      if (octopus.right) {
        if (!octopi[y][x+1]) {
          octopi[y][x+1] = {
            value: octopus.right
          }
        }
        octopi[y][x+1].left = octopus;
      }

      // Top Left
      if (octopus.topLeft) {
        if (!octopi[y-1][x-1]) {
          octopi[y-1][x-1] = {
            value: octopus.topLeft
          }
        }
        octopi[y-1][x-1].bottomRight = octopus;
      }

      // Top Right
      if (octopus.topRight) {
        if (!octopi[y-1][x+1]) {
          octopi[y-1][x+1] = {
            value: octopus.topRight
          }
        }
        octopi[y-1][x+1].bottomLeft = octopus;
      }

      // Bottom Left
      if (octopus.bottomLeft) {
        if (!octopi[y+1][x-1]) {
          octopi[y+1][x-1] = {
            value: octopus.bottomLeft
          }
        }
        octopi[y+1][x-1].topRight = octopus;
      }

      // Bottom Right
      if (octopus.bottomRight) {
        if (!octopi[y+1][x+1]) {
          octopi[y+1][x+1] = {
            value: octopus.bottomRight
          }
        }
        octopi[y+1][x+1].topLeft = octopus;
      }

    }

  }

  let flattenedOctopi = octopi.flat();
  let flashCounts: number = 0;
  let steps = 100;

  // The objects are shared meaning we can cache whether or not a node has been visited, reducing recursion visits.
  for (let step = 1; step <= steps; step++) {

    for (let i = 0; i < flattenedOctopi.length; i++) {

      let octopus = flattenedOctopi[i];
      
      if (step !== octopus.step) {
        octopus.step = step;
        octopus.flashed = false;
        octopus.stepped = false;
        octopus.upProc = false;
        octopus.downProc = false;
        octopus.leftProc = false;
        octopus.rightProc = false;
        octopus.topLeftProc = false;
        octopus.topRightProc = false;
        octopus.bottomLeftProc = false;
        octopus.bottomRightProc = false;
        if (octopus.newValue || octopus.newValue === 0) {
          octopus.value = octopus.newValue * 1;
        }
        octopus.newValue = undefined;
      }

      let startingValue = octopus.value;

      if (octopus.flashed) {
        continue;
      }

      if (!octopus.stepped) {
        if (startingValue === 9) {
          octopus.stepped = true;
          octopus.newValue = 0;
          octopus.flashed = true;
          flashCounts = flashCounts + 1;
          i = -1;
          continue;
        } else {
          octopus.stepped = true;
          if (octopus.newValue || octopus.newValue === 0) {
            octopus.newValue = octopus.newValue + 1;
          } else {
            octopus.newValue = octopus.value + 1;
          }
        }
      }


      if (octopus.up?.flashed && octopus.up?.step === step) {
        if (!octopus.upProc) {
          octopus.upProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.down?.flashed && octopus.down?.step === step) {
        if (!octopus.downProc) {
          octopus.downProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.left?.flashed && octopus.left?.step === step) {
        if (!octopus.leftProc) {
          octopus.leftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.right?.flashed && octopus.right?.step === step) {
        if (!octopus.rightProc) {
          octopus.rightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.topLeft?.flashed && octopus.topLeft?.step === step) {
        if (!octopus.topLeftProc) {
          octopus.topLeftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.topRight?.flashed && octopus.topRight?.step === step) {
        if (!octopus.topRightProc) {
          octopus.topRightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.bottomLeft?.flashed && octopus.bottomLeft?.step === step) {
        if (!octopus.bottomLeftProc) {
          octopus.bottomLeftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.bottomRight?.flashed && octopus.bottomRight?.step === step) {
        if (!octopus.bottomRightProc) {
          octopus.bottomRightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

    }
  
  }

  result = flashCounts;

  console.log(result);

};

async function processPartTwo() {

  // Part Two is the same as Part One, except after every step we need to check if all octopi are 0

  let result = 0;
  let octopi: any[] = [];
  
  for (let y = 0; y < dataContainer.length; y++) {

    octopi[y] = octopi[y] ?? [];
    octopi[y+1] = octopi[y+1] ?? [];

    for (let x = 0; x < dataContainer[y].length; x++) {

      let octopus: { [key: string]: any } = {};

      octopus.value = Number(dataContainer[y][x]);

      if (y > 0) {
        octopus.upNum = Number(dataContainer[y-1][x]);
        octopus.up = octopi[y-1][x];
      }

      if (x > 0) {
        octopus.leftNum = Number(dataContainer[y][x-1]);
        octopus.left = octopi[y][x-1];
      }

      if (y !== dataContainer.length - 1) {
        octopus.downNum = Number(dataContainer[y+1][x]);
        octopus.down = octopi[y+1][x];
      }

      if (x !== dataContainer[y].length - 1) {
        octopus.rightNum = Number(dataContainer[y][x+1]);
        octopus.right = octopi[y][x+1];
      }
      
      // Top Left
      if (y > 0 && x > 0) {
        octopus.topLeftNum = Number(dataContainer[y-1][x-1]);
        octopus.topLeft = octopi[y-1][x-1];
      }

      // Top Right
      if (y > 0 && x !== dataContainer[y].length - 1) {
        octopus.topRightNum = Number(dataContainer[y-1][x+1]);
        octopus.topRight = octopi[y-1][x+1];
      }

      // Bottom Left
      if (y !== dataContainer.length - 1 && x > 0) {
        octopus.bottomLeftNum = Number(dataContainer[y+1][x-1]);
        octopus.bottomLeft = octopi[y+1][x-1];
      }

      // Bottom Right
      if (y !== dataContainer.length - 1 && x !== dataContainer[y].length - 1) {
        octopus.bottomRightNum = Number(dataContainer[y+1][x+1]);
        octopus.bottomRight = octopi[y+1][x+1];
      }

      octopi[y][x] = octopus;

      if (octopus.up) {
        if (!octopi[y-1][x]) {
          octopi[y-1][x] = {
            value: octopus.up
          }
        }
        octopi[y-1][x].down = octopus;
      }

      if (octopus.left) {
        if (!octopi[y][x-1]) {
          octopi[y][x-1] = {
            value: octopus.left
          }
        }
        octopi[y][x-1].right = octopus;
      }

      if (octopus.down) {
        if (!octopi[y+1][x]) {
          octopi[y+1][x] = {
            value: octopus.down
          }
        }
        octopi[y+1][x].up = octopus;
      }

      if (octopus.right) {
        if (!octopi[y][x+1]) {
          octopi[y][x+1] = {
            value: octopus.right
          }
        }
        octopi[y][x+1].left = octopus;
      }

      // Top Left
      if (octopus.topLeft) {
        if (!octopi[y-1][x-1]) {
          octopi[y-1][x-1] = {
            value: octopus.topLeft
          }
        }
        octopi[y-1][x-1].bottomRight = octopus;
      }

      // Top Right
      if (octopus.topRight) {
        if (!octopi[y-1][x+1]) {
          octopi[y-1][x+1] = {
            value: octopus.topRight
          }
        }
        octopi[y-1][x+1].bottomLeft = octopus;
      }

      // Bottom Left
      if (octopus.bottomLeft) {
        if (!octopi[y+1][x-1]) {
          octopi[y+1][x-1] = {
            value: octopus.bottomLeft
          }
        }
        octopi[y+1][x-1].topRight = octopus;
      }

      // Bottom Right
      if (octopus.bottomRight) {
        if (!octopi[y+1][x+1]) {
          octopi[y+1][x+1] = {
            value: octopus.bottomRight
          }
        }
        octopi[y+1][x+1].topLeft = octopus;
      }

    }

  }

  let flattenedOctopi = octopi.flat();
  let flashCounts: number = 0;
  // It feels like there is a better way than brute forcing the number of steps needed but in this case it was after 382 steps
  let steps = 400;

  // The objects are shared meaning we can cache whether or not a node has been visited, reducing recursion visits.
  for (let step = 1; step <= steps; step++) {

    for (let i = 0; i < flattenedOctopi.length; i++) {

      let octopus = flattenedOctopi[i];
      
      if (step !== octopus.step) {
        octopus.step = step;
        octopus.flashed = false;
        octopus.stepped = false;
        octopus.upProc = false;
        octopus.downProc = false;
        octopus.leftProc = false;
        octopus.rightProc = false;
        octopus.topLeftProc = false;
        octopus.topRightProc = false;
        octopus.bottomLeftProc = false;
        octopus.bottomRightProc = false;
        if (octopus.newValue || octopus.newValue === 0) {
          octopus.value = octopus.newValue * 1;
        }
        octopus.newValue = undefined;
      }

      let startingValue = octopus.value;

      if (octopus.flashed) {
        continue;
      }

      if (!octopus.stepped) {
        if (startingValue === 9) {
          octopus.stepped = true;
          octopus.newValue = 0;
          octopus.flashed = true;
          flashCounts = flashCounts + 1;
          i = -1;
          continue;
        } else {
          octopus.stepped = true;
          if (octopus.newValue || octopus.newValue === 0) {
            octopus.newValue = octopus.newValue + 1;
          } else {
            octopus.newValue = octopus.value + 1;
          }
        }
      }


      if (octopus.up?.flashed && octopus.up?.step === step) {
        if (!octopus.upProc) {
          octopus.upProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.down?.flashed && octopus.down?.step === step) {
        if (!octopus.downProc) {
          octopus.downProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.left?.flashed && octopus.left?.step === step) {
        if (!octopus.leftProc) {
          octopus.leftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.right?.flashed && octopus.right?.step === step) {
        if (!octopus.rightProc) {
          octopus.rightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.topLeft?.flashed && octopus.topLeft?.step === step) {
        if (!octopus.topLeftProc) {
          octopus.topLeftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.topRight?.flashed && octopus.topRight?.step === step) {
        if (!octopus.topRightProc) {
          octopus.topRightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.bottomLeft?.flashed && octopus.bottomLeft?.step === step) {
        if (!octopus.bottomLeftProc) {
          octopus.bottomLeftProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

      if (octopus.bottomRight?.flashed && octopus.bottomRight?.step === step) {
        if (!octopus.bottomRightProc) {
          octopus.bottomRightProc = true;
          octopus.newValue = octopus.newValue + 1;
          if (octopus.newValue === 10) {
            octopus.newValue = 0;
            octopus.flashed = true;
            flashCounts = flashCounts + 1;
            i = -1;
            continue;
          }
        }
      }

    }

    // Check if all octopi are 0
    if (flattenedOctopi.every(octopus => octopus.newValue === 0)) {
      result = step;
      break;
    }
  
  }

  console.log(result);

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