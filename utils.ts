class Utils {
  defaultReducer = (r: number[]): number =>
    r.reduce((first, second) => first + second);
}

export default Utils;
