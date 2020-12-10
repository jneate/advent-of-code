import fs from 'fs';

let fileContents = fs.readFileSync('input.txt', 'utf8'),
    passwordArray = [],
    passwordRegexArray = [],
    validPasswords = [],
    start = Date.now(),
    part = 2;

for (let item of fileContents.split('\n')) {
  let lineArray = item.split(':');
  passwordArray.push(lineArray[1].trim());
  passwordRegexArray.push(lineArray[0]);
}

for (let i = 0; i < passwordArray.length; i++) {

  let password = passwordArray[i],
      regexArray = passwordRegexArray[i].split(' '),
      regexBoundArray = regexArray[0].split('-'),
      regexCharacter = regexArray[1],
      regexMinLength = regexBoundArray[0],
      regexMaxLength = regexBoundArray[1];
  
  if (part === 1) {

    let countOfChars = password.split(regexCharacter).length - 1;
  
    if (countOfChars >= regexMinLength && countOfChars <= regexMaxLength) {
      validPasswords.push(password);
    }

  } else if (part === 2) {
    
    let firstIndexFlag = false,
        secondIndexFlag = false,
        firstIndexChar = password.charAt(regexMinLength - 1),
        secondIndexChar = password.charAt(regexMaxLength - 1);

    if (firstIndexChar === regexCharacter) {
      firstIndexFlag = true;
    }

    if (secondIndexChar === regexCharacter) {
      secondIndexFlag = true;
    }

    if ((firstIndexFlag && !secondIndexFlag) || (!firstIndexFlag && secondIndexFlag)) {
      validPasswords.push(password);
    }

  }


}

console.log(validPasswords.length);
console.log(Date.now() - start);