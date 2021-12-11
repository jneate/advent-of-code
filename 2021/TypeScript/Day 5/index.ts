import events from 'events';
import fs from 'fs';
import { tmpdir } from 'os';
import * as readline from 'readline';

let dataContainer: string[] = [];
let gridContainer: number[][] = [[]];
let gridSize = 10;

async function loadFile(fileName: string) {

  let counter = 0;
  let tempArray: Array<number[]> = [];

  // await resetGrid();

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

  for (let line of dataContainer) {

    const splitLine = line.split(' -> ');

    let tempObj = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    }
  
    let coOrds = splitLine[0].split(',');
    tempObj.x1 = Number(coOrds[0]);
    tempObj.y1 = Number(coOrds[1]);
  
    coOrds = splitLine[1].split(',');
    tempObj.x2 = Number(coOrds[0]);
    tempObj.y2 = Number(coOrds[1]);
  
    if (tempObj.x1 === tempObj.x2) {
      // Check how long the line is vertically
      let length = Math.abs(tempObj.y1 - tempObj.y2);
      let start = tempObj.y1 < tempObj.y2 ? tempObj.y1 : tempObj.y2;
      for (let i = start; i <= start + length; i++) {
        if (!gridContainer[i]) {
          gridContainer[i] = [];
        }
        gridContainer[i][tempObj.x1] = gridContainer[i][tempObj.x1] ? gridContainer[i][tempObj.x1] + 1 :  1;
      }
    } else if (tempObj.y1 === tempObj.y2) {
      // Check how long the line is horizontally
      let length = Math.abs(tempObj.x1 - tempObj.x2);
      let start = tempObj.x1 < tempObj.x2 ? tempObj.x1 : tempObj.x2;
      if (!gridContainer[tempObj.y1]) {
        gridContainer[tempObj.y1] = [];
      }
      for (let i = start; i <= start + length; i++) {
        gridContainer[tempObj.y1][i] = gridContainer[tempObj.y1][i] ? gridContainer[tempObj.y1][i] + 1 : 1;
      }
    }

  }

  for (let row of gridContainer) {
    if (row) {
      let filteredRow = row.filter(point => point > 1);
      result = result + filteredRow.length;
    }
  }

  console.log(result);

};

async function processPartTwo() {

  let result = 0;
  gridContainer = [];

  for (let line of dataContainer) {

    const splitLine = line.split(' -> ');

    let tempObj = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    }
  
    let coOrds = splitLine[0].split(',');
    tempObj.x1 = Number(coOrds[0]);
    tempObj.y1 = Number(coOrds[1]);
  
    coOrds = splitLine[1].split(',');
    tempObj.x2 = Number(coOrds[0]);
    tempObj.y2 = Number(coOrds[1]);

    let xLength = Math.abs(tempObj.x1 - tempObj.x2);
    let yLength = Math.abs(tempObj.y1 - tempObj.y2);
    
    // 45 Degrees means change in height and length is the same
    if (xLength === yLength) {
      // Diagonal needed for Part Two

      let x1Lower = tempObj.x1 < tempObj.x2;
      let y1Lower = tempObj.y1 < tempObj.y2;
      
      let length = Math.abs(tempObj.x1 - tempObj.x2);

      for (let i = 0; i <= length; i++) {

        let xPos, yPos;

        if (x1Lower) {
          xPos = i + tempObj.x1;
        } else {
          xPos = tempObj.x1 - i;
        }

        if (y1Lower) {
          yPos = i + tempObj.y1;
        } else {
          yPos = tempObj.y1 - i;
        }
        
        if (!gridContainer[yPos]) {
          gridContainer[yPos] = [];
        }

        gridContainer[yPos][xPos] = gridContainer[yPos][xPos] ? gridContainer[yPos][xPos] + 1 : 1;

      }

    } else if (tempObj.x1 === tempObj.x2) {
      // Check how long the line is vertically
      let length = Math.abs(tempObj.y1 - tempObj.y2);
      let start = tempObj.y1 < tempObj.y2 ? tempObj.y1 : tempObj.y2;
      for (let i = start; i <= start + length; i++) {
        if (!gridContainer[i]) {
          gridContainer[i] = [];
        }
        gridContainer[i][tempObj.x1] = gridContainer[i][tempObj.x1] ? gridContainer[i][tempObj.x1] + 1 :  1;
      }
    } else if (tempObj.y1 === tempObj.y2) {
      // Check how long the line is horizontally
      let length = Math.abs(tempObj.x1 - tempObj.x2);
      let start = tempObj.x1 < tempObj.x2 ? tempObj.x1 : tempObj.x2;
      if (!gridContainer[tempObj.y1]) {
        gridContainer[tempObj.y1] = [];
      }
      for (let i = start; i <= start + length; i++) {
        gridContainer[tempObj.y1][i] = gridContainer[tempObj.y1][i] ? gridContainer[tempObj.y1][i] + 1 : 1;
      }
    }

  }

  for (let row of gridContainer) {
    if (row) {
      let filteredRow = row.filter(point => point > 1);
      result = result + filteredRow.length;
    }
  }

  console.log(result);

};

async function resetData() {
  
  dataContainer = [];
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