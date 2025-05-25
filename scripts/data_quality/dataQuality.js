function findSmallestDifference(dataArray) {
  if (dataArray.length < 2) {
      return "Array must have at least two numbers";
  }

  let minDiff = Infinity;
  let num1, num2;

  // Compare every pair of numbers
  for (let i = 0; i < dataArray.length; i++) {
      for (let j = i + 1; j < dataArray.length; j++) {
          let diff = Math.abs(dataArray[i] - dataArray[j])
          if (diff < minDiff) {
              minDiff = diff;
              num1 = dataArray[i];
              num2 = dataArray[j];
          }
      }
  }

  return { difference: minDiff, numbers: [num1, num2] };
}

function validPointsArray(num1, num2, dataPoints) {
  let validData = [] //data
  let validIndexes = [] //indexes of accepted workers
  let nonValidIndexes = [] //indexes of denied workers

  let averageMostSimilar = Math.abs(( num1 + num2 ) / 2)
  console.log('average most similar: ', averageMostSimilar)

  for (let i = 0; i < dataPoints.length; i++) {
    if((dataPoints[i] > averageMostSimilar - 2) && (dataPoints[i] < averageMostSimilar + 2)) {
    validData.push(dataPoints[i])
    validIndexes.push(i)
    } else {
      nonValidIndexes.push(i)
    }
  }

  return { validData: validData, validIndexes: validIndexes, nonValidIndexes: nonValidIndexes}
}

// Test:
// const dataArray = [7, 10, 7.5, 8, 10.8, 11, 10.2, 10.1];

// const result = findSmallestDifference(dataArray)
// console.log(result.numbers[0], result.numbers[1])

// const validData = validPointsArray(result.numbers[0], result.numbers[1], dataArray)
// console.log("Data accepted: ", validData.validData)
// console.log("Congratulations, you are rewarded: ", validData.validIndexes)
// console.log("Penalized: ", validData.nonValidIndexes)


module.exports = { findSmallestDifference, validPointsArray }