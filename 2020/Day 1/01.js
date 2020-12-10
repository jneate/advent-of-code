import fs from 'fs';

let fileContents = fs.readFileSync('expenseReport.txt', 'utf8'),
    numberArray = [],
    possibleNumbers = [],
    upperBound = 2020,
    part = 1,
    start = Date.now();

for (let item of fileContents.split('\n')) {
  numberArray.push(Number(item));
}

for (let i = 0; i < numberArray.length; i++) {

  if (possibleNumbers.length > 0) {
    break;
  }

  for (let j = 0; j < numberArray.length; j++) {

    if (possibleNumbers.length > 0) {
      break;
    }

    if (part === 1) {

      if (numberArray[i] + numberArray[j] === upperBound) {
        possibleNumbers.push(numberArray[i]);
        possibleNumbers.push(numberArray[j]);
        break;
      }

    } else if (part === 2) {

      for (let k = 0; k < numberArray.length; k++) {

        if (i !== j && possibleNumbers.length === 0) {
          if (numberArray[i] + numberArray[j] + numberArray[k] === upperBound) {
            possibleNumbers.push(numberArray[i]);
            possibleNumbers.push(numberArray[j]);
            possibleNumbers.push(numberArray[k]);
            break;
          }
        }
  
      }

    }
    
  }

}

console.log(possibleNumbers);
console.log(possibleNumbers.reduce((total, currentValue) => total * currentValue));

console.log(Date.now() - start);