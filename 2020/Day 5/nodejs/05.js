import fs from 'fs';

let fileContents = fs.readFileSync('input.txt', 'utf8');
// let fileContents = fs.readFileSync('test.txt', 'utf8');

let rowArray = [],
    columnArray = [],
    planeRowArray = [],
    planeColumnArray = [],
    start = Date.now(),
    setupCompleted = false,
    maxRows = 128,
    maxColumns = 8,
    nextRowArea = maxRows,
    nextColumnArea = maxColumns,
    seat = [],
    seatMap = new Map();

for (let item of fileContents.split('\n')) {

  rowArray.push(item.substring(0, 7));
  columnArray.push(item.substring(7));

}

while (!setupCompleted) {

  nextRowArea = nextRowArea / 2;
  planeRowArray.push(nextRowArea);

  if (nextColumnArea !== 1) {
    nextColumnArea = nextColumnArea / 2;
    planeColumnArray.push(nextColumnArea);
  }

  if (nextRowArea === 1) {
    setupCompleted = true;
  }

}

for (let rowString of rowArray) {

  let nextArea = maxRows / 2;

  for (let i = 0; i < rowString.length; i++) {

    if (rowString.charAt(i) === 'F') {
      nextArea = nextArea - (planeRowArray[i] / 2);
    } else {
      nextArea = nextArea + (planeRowArray[i] / 2);
    }

    if (i === rowString.length - 1) {
      seat.push({
        row: Math.round(nextArea - 1) + 0 // Minus one as the plane rows go 0-127 not 1-128
      });
    }

  }

}

for (let i = 0; i < columnArray.length; i++) {

  let columnString = columnArray[i],
      nextArea = maxColumns / 2;

  for (let j = 0; j < columnString.length; j++) {

    if (columnString.charAt(j) === 'L') {
      nextArea = nextArea - (planeColumnArray[j] / 2);
    } else {
      nextArea = nextArea + (planeColumnArray[j] / 2);
    }
    
    if (j === columnString.length - 1) {
      let column = Math.round(nextArea - 1) + 0; // Minus one as the plane columns go 0-7 not 1-8. + 0 to save calling Math.abs
      seat[i] = (seat[i].row * 8) + column;
      seatMap.set(seat[i], seat[i]);
      break;
    }

  }

}

let maxSeatID = seat.reduce((total, currentValue) => currentValue > total ? currentValue : total),
    minSeatID = seat.reduce((total, currentValue) => currentValue < total ? currentValue : total);

for (let i = minSeatID; i < maxSeatID; i++) {

  if (!seatMap.get(i) && seatMap.get(i - 1) && seatMap.get(i + 1)) {
    console.log(`Missing Seat ID: ${ i }`);
  }

}

console.log(`Max Seat ID: ${ maxSeatID }`); // Part 1
console.log(Date.now() - start);