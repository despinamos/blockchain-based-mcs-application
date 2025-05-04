function dataValidation(dataArray, windowSize = 3, threshold = 0.5) {
  if (dataArray.length < windowSize) {
    return "Array of data must have at least as many values as the window size";
  }

  const sortedData = [...dataArray].sort((a, b) => a - b);
  let bestWindow = [];
  let minSpread = Infinity;

  // Slide a window over sorted data
  for (let i = 0; i <= sortedData.length - windowSize; i++) {
    const window = sortedData.slice(i, i + windowSize);
    const spread = window[window.length - 1] - window[0];
    if (spread < minSpread) {
      minSpread = spread;
      bestWindow = window;
    }
  }

  // Average of the tightest cluster as the center
  const clusterCenter = bestWindow.reduce((sum, val) => sum + val, 0) / bestWindow.length;

  const validData = []; // Valid data
  const validIndexes = []; // Indexes of workers with valid data
  const nonValidIndexes = []; // Indexes of workers with invalid data

  dataArray.forEach((val, idx) => {
    if (Math.abs(val - clusterCenter) <= threshold) {
      validData.push(val);
      validIndexes.push(idx);
    } else {
      nonValidIndexes.push(idx);
    }
  });

  return {
    clusterCenter,
    validData,
    validIndexes,
    nonValidIndexes
  };
}

const data = [11, 5, 5.5, 10, 4.9, -2, 5.25, 11, 3.5];

const result = dataValidation(data);

console.log("Cluster center:", result.clusterCenter);
console.log("Valid data:", result.validData);
console.log("Worker indexes with valid data:", result.validIndexes);
console.log("Worker indexes with invalid data:", result.nonValidIndexes);