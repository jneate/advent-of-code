import fs from 'fs';

let fileContents = fs.readFileSync('input.txt', 'utf8');
// let fileContents = fs.readFileSync('test.txt', 'utf8');

let passportArray = [],
    validPassports = 0,
    start = Date.now(),
    byrValidation = byr => byr.length === 4 && Number(byr) >= 1920 && Number(byr) <= 2002,
    iyrValidation = iyr => iyr.length === 4 && Number(iyr) >= 2010 && Number(iyr) <= 2020,
    eyrValidation = eyr => eyr.length === 4 && Number(eyr) >= 2020 && Number(eyr) <= 2030,
    hgtValidation = hgt => {
      let length = hgt.length,
          hgtType = hgt.substring(length - 2),
          hgtValue = Number(hgt.substring(0, length - 2));
      return (hgtType === 'cm' && hgtValue >= 150 && hgtValue <= 193) || (hgtType === 'in' && hgtValue >= 59 && hgtValue <= 76);
    },
    hclValidation = hcl => hcl.substring(0, 1) === '#' && hcl.substring(1).length === 6 && hcl.substring(1).search('/[g-z]+/g') === -1,
    eclValidation = ecl => ecl === 'amb' || ecl === 'blu' || ecl === 'brn' || ecl === 'gry' || ecl === 'grn' || ecl === 'hzl' || ecl === 'oth',
    pidValidation = pid => pid.length === 9 && !isNaN(pid),
    validationMap = new Map();

validationMap.set('byr', byrValidation);
validationMap.set('iyr', iyrValidation);
validationMap.set('eyr', eyrValidation);
validationMap.set('hgt', hgtValidation);
validationMap.set('hcl', hclValidation);
validationMap.set('ecl', eclValidation);
validationMap.set('pid', pidValidation);

function isPassportValid(passport) {

  for (let field of validationMap.keys()) {

    let passportField = passport[field],
        validationFunction = validationMap.get(field);

    if (!passportField) {
      return false;
    }

    if (!validationFunction(passportField)) {
      return false;
    }

  }

  return true;

}

for (let item of fileContents.split('\n\n')) { // Passport is separated by 2 new lines with no characters in between

  let passportFields = item.split('\n').join(' ').split(' '),
      passportObject = { };
  
  passportFields.forEach(field => {
    let separator = field.indexOf(':'),
        key = field.substring(0, separator),
        value = field.substring(separator + 1);
    passportObject[key] = value;
  });

  passportArray.push(passportObject);

}

validPassports = passportArray.length;

for (let passport of passportArray) {

  if (!isPassportValid(passport)) {
    validPassports = validPassports - 1;
  }

}

console.log(validPassports);
console.log(Date.now() - start);