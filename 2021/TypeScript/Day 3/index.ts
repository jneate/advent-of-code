import events from 'events';
import fs from 'fs';
import * as readline from 'readline';

let dataContainer: string[] = [];
let mostCommon: string[] = [];
let leastCommon: string[] = [];
let result: number = 0;

async function loadFile(fileName: string) {
  console.log('Reading File');
  try {
    const readStream = readline.createInterface({
      input: fs.createReadStream(fileName),
      crlfDelay: Infinity
    });

    readStream.on('line', (line) => {
      const splitLine = line.split(' ');
      dataContainer.push(line)
    });

    await events.once(readStream, 'close');

    console.log('File Read');
  } catch (err) {
    console.error(err);
  }
};

async function processPartOne() {

  let characterCount: Array<{ one: number, zero: number }> = [];
  mostCommon = [];
  leastCommon = [];

  for (const diagnostic of dataContainer) {

    for (let j = 0; j < diagnostic.length; j++) {

      if (!characterCount[j]) {
        characterCount[j] = {
          one: 0,
          zero: 0
        }
      }

      if (diagnostic.charAt(j) === "0") {
        characterCount[j].zero = characterCount[j].zero + 1;
      } else if (diagnostic.charAt(j) === "1") {
        characterCount[j].one = characterCount[j].one + 1;
      }

    }

  }

  characterCount.forEach(count => {

    if (count.one > count.zero) {
      mostCommon.push("1");
    } else if (count.one === count.zero) {
      mostCommon.push("1");
    } else {
      mostCommon.push("0");
    }

    if (count.one < count.zero) {
      leastCommon.push("1");
    } else {
      leastCommon.push("0");
    }

  })

  let gammaRate = mostCommon.join('');
  let epsilonRate = leastCommon.join('');

  result = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);

};

async function processPartTwo() {

  // Part Two implementation re-uses part one to determine the most common bit, just filter the dataset used by Part one to reduce the comparison
  // Could probably manage with one loop in Part Two if I changed the data set used by Part One, but 28ms isn't too bad

  result = 0;
  let characterCount: Array<{ one: number, zero: number }> = [];

  let diagnostic = dataContainer[0];
  const origContainer = dataContainer;

  for (let i = 0; i < diagnostic.length; i++) {

    await processPartOne();
    
    dataContainer = dataContainer.filter(record => record.charAt(i) === mostCommon[i]);

    if (dataContainer.length === 1) {
      break;
    }

  }

  let oxygenRating = parseInt(dataContainer[0], 2);

  dataContainer = origContainer;

  for (let i = 0; i < diagnostic.length; i++) {

    await processPartOne();
    
    dataContainer = dataContainer.filter(record => record.charAt(i) === leastCommon[i]);

    if (dataContainer.length === 1) {
      break;
    }

  }

  let co2Scrubber = parseInt(dataContainer[0], 2);

  result = oxygenRating * co2Scrubber;

  console.log(result);

};

async function resetData() {
  
  dataContainer = [];
  mostCommon = [];
  leastCommon = [];

}

async function start() {

  let time = Date.now();

  console.log("Test Data");

  await loadFile(`${__dirname}\\test.txt`);
  await processPartOne();
  console.log(result);
  time = Date.now();
  await processPartTwo();
  console.log(`Part 2 took ${Date.now() - time}ms`);

  await resetData();

  console.log("Input Data");
  
  await loadFile(`${__dirname}\\inputs.txt`);
  await processPartOne();
  console.log(result);
  await processPartTwo();
  console.log(`Part 2 took ${Date.now() - time}ms`);

};

start();