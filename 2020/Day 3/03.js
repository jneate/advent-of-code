import fs from 'fs';

let fileContents = fs.readFileSync('input.txt', 'utf8');
// let fileContents = fs.readFileSync('test.txt', 'utf8');

let sledRoutePaths = [],
    routeLength = 0,
    openRoute = '.',
    treeRoute = '#',
    directionRightArray = [1, 3, 5, 7, 1],
    directionDownArray = [1, 1, 1, 1, 2],
    positionX = 0,
    positionY = 0,
    treeCounts = [],
    start = Date.now();

for (let item of fileContents.split('\n')) {
  sledRoutePaths.push(item);
}

routeLength = sledRoutePaths[0].length;

for (let slopeIndex = 0; slopeIndex < directionRightArray.length; slopeIndex++) {

  let treeCount = 0,
      directionRight = directionRightArray[slopeIndex],
      directionDown = directionDownArray[slopeIndex];

  positionX = 0;
  positionY = 0;

  for (let i = 0; i < sledRoutePaths.length; i++) {

    if (positionY + directionDown >= sledRoutePaths.length) {
      break;
    }
  
    let nextRoutePath = sledRoutePaths[positionY + directionDown],
      landingPosition = (positionX + directionRight) % routeLength,
      landingCharacter = nextRoutePath.charAt(landingPosition);
  
    positionX = landingPosition;
    positionY = positionY + directionDown;
  
    if (landingCharacter === treeRoute) {
      treeCount = treeCount + 1;
    }
  
  }

  treeCounts.push(treeCount);

}

console.log(treeCounts);
console.log(treeCounts.reduce((total, currentValue) => total * currentValue));
console.log(Date.now() - start);