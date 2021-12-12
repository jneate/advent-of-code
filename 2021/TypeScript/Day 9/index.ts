import events from 'events';
import fs from 'fs';
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
  let lowPoints: number[] = [];
  
  for (let y = 0; y < dataContainer.length; y ++) {

    for (let x = 0; x < dataContainer[y].length; x++) {

      let indices: { [key: string]: number } = {};

      indices.point = Number(dataContainer[y][x]);

      if (y > 0) {
        indices.up = Number(dataContainer[y-1][x]);
      }

      if (x > 0) {
        indices.left = Number(dataContainer[y][x-1]);
      }

      if (y !== dataContainer.length - 1) {
        indices.down = Number(dataContainer[y+1][x]);
      }

      if (x !== dataContainer[y].length - 1) {
        indices.right = Number(dataContainer[y][x+1]);
      }

      if (indices.point < (indices.up ?? Number.MAX_SAFE_INTEGER)
        && indices.point < (indices.left ?? Number.MAX_SAFE_INTEGER)
        && indices.point < (indices.down ?? Number.MAX_SAFE_INTEGER)
        && indices.point < (indices.right ?? Number.MAX_SAFE_INTEGER)
        ) {
          lowPoints.push(indices.point);
      }

    }

  }

  result = lowPoints.map(point => point + 1).reduce((prev, next) => prev + next, 0);

  console.log(result);

};

async function processPartTwo() {

  let result = 0;
  let lowPoints: number[] = [];

  let basins: any[] = [];
  
  for (let y = 0; y < dataContainer.length; y ++) {

    basins[y] = basins[y] ?? [];
    basins[y+1] = [];

    for (let x = 0; x < dataContainer[y].length; x++) {

      let indices: { [key: string]: number } = {};

      indices.point = Number(dataContainer[y][x]);

      if (y > 0) {
        indices.upNum = Number(dataContainer[y-1][x]);
        indices.up = basins[y-1][x];
      }

      if (x > 0) {
        indices.leftNum = Number(dataContainer[y][x-1]);
        indices.left = basins[y][x-1];
      }

      if (y !== dataContainer.length - 1) {
        indices.downNum = Number(dataContainer[y+1][x]);
        indices.down = basins[y+1][x];
      }

      if (x !== dataContainer[y].length - 1) {
        indices.rightNum = Number(dataContainer[y][x+1]);
        indices.right = basins[y][x+1];
      }

      basins[y][x] = indices;

      if (indices.up) {
        if (!basins[y-1][x]) {
          basins[y-1][x] = {
            point: indices.up
          }
        }
        basins[y-1][x].down = indices;
      }

      if (indices.left) {
        if (!basins[y][x-1]) {
          basins[y][x-1] = {
            point: indices.left
          }
        }
        basins[y][x-1].right = indices;
      }

      if (indices.down) {
        if (!basins[y+1][x]) {
          basins[y+1][x] = {
            point: indices.down
          }
        }
        basins[y+1][x].up = indices;
      }

      if (indices.right) {
        if (!basins[y][x+1]) {
          basins[y][x+1] = {
            point: indices.right
          }
        }
        basins[y][x+1].left = indices;
      }
      // console.log(indices);
      // console.log(basins);

    }

  }

  let totalObjects = basins.flat();
  let totalBasins: number[] = [];

  // The objects are shared meaning we can cache whether or not a node has been visited, reducing recursion visits.
  for (let index of totalObjects) {
    totalBasins.push(process(index));
  }
  
  result = totalBasins.filter(count => count !== 0).sort(inverseSort).slice(0,3).reduce((prev, next) => prev * next);

  console.log(result);

};

function inverseSort(a: number, b: number): number {

  if (a < b) {
    return 1;
  }

  if (a > b) {
    return -1;
  }

  return 0;

}

function process(node: any) {
  
  // Need to cache visited nodes to avoid overflow & speeds up processing time
  if (node.visited) {
    return 0;
  }

  if (node.point === 9) {
    return 0;
  }

  node.visited = true;
  node.counter = 0;

  // Terminal node (i.e. has 9 on an index)
  if (node.upNum === 9
    || node.downNum === 9
    || node.leftNum === 9
    || node.rightNum === 9) {
      node.counter = node.counter + 1;
  } else {
    // Transient node (i.e. no 9s nearby)
    node.counter = 1;
  }
  
  if (node.up) {
    node.counter = node.counter + process(node.up);
  }
  
  if (node.down) {
    node.counter = node.counter + process(node.down);
  }

  if (node.left) {
    node.counter = node.counter + process(node.left);
  }
  
  if (node.right) {
    node.counter = node.counter + process(node.right);
  }

  return node.counter;

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