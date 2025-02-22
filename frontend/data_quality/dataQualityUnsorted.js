function findSmallestDifferenceUnsorted(arr) {
  if (arr.length < 2) {
      return "Array must have at least two numbers";
  }

  let minDiff = Infinity;
  let num1, num2;

  // Compare every pair of numbers
  for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
          let diff = Math.abs(arr[i] - arr[j])
        // let diff = Math.hypot(arr[i], arr[j])
          if (diff < minDiff) {
              minDiff = diff;
              num1 = arr[i];
              num2 = arr[j];
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
const dataArray = [7, 10, 7.5, 8, 10.8, 11, 13, 12, 10.2, 15, 10.1];

const result = findSmallestDifferenceUnsorted(dataArray)
console.log(result.numbers[0], result.numbers[1])

const validData = validPointsArray(result.numbers[0], result.numbers[1], dataArray)
console.log("Valid data and indexes are: ", validData.validData , validData.validIndexes, validData.nonValidIndexes)

