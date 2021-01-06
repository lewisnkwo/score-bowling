class Utils {
  defaultReducer = (r: number[]): number =>
    r.reduce((first, second) => first + second);

  calculatePins = (pinLimit?: number) =>
    pinLimit
      ? Math.floor(Math.random() * (pinLimit + 1))
      : Math.floor(Math.random() * 11);
}

export default Utils;
