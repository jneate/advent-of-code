import fs from 'fs';

let fileContents = fs.readFileSync('input.txt', 'utf8');
// let fileContents = fs.readFileSync('test.txt', 'utf8');

let passengerGroupArray = [],
    start = Date.now(),
    sumOfYes = 0,
    part1 = false,
    part2 = true;

for (let passengerGroups of fileContents.split('\n\n')) {

  passengerGroupArray.push(passengerGroups);

}

for (let passengerGroup of passengerGroupArray) {

  // Break each group into individual passengers
  let passengers = passengerGroup.split('\n'),
      questionsWithYes = new Map(); // Create a map to store each YES answer

  for (let passenger of passengers) { // Iterate through each passenger in a group

    
      for (let question of passenger.split('')) {

        if (part1) {
          if (!questionsWithYes.has(question)) { // Part 1 checks if ANYONE in the group answered yes
            questionsWithYes.set(question, 1);
          }
        }

        // Part 2 checks if EVERYONE has answered yes, simply add all the first persons questions into the map
        // if the next person in the group doesn't answer the question then remove the entry from the map
        if (part2) {

          let count = 1;
  
          if (questionsWithYes.has(question)) {
            count = questionsWithYes.get(question) + 1;
          }
  
          questionsWithYes.set(question, count);

        }
        
      }

      if (part2) {
        for (let passengerCount of questionsWithYes.values()) {
          if (passengerCount === passengers.length) {
            sumOfYes = sumOfYes + 1;
          }
        }
      }

  }

  if (part1) {
    sumOfYes = sumOfYes + questionsWithYes.size;
  }

}

console.log(`Total Yes Qs: ${ sumOfYes }`); // Part 1
console.log(Date.now() - start);