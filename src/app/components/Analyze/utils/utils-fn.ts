const lengthReduce = (data: unknown[][]): number =>
  data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.length,
    0
  );

export default lengthReduce;
