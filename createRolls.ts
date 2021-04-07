import { Roll, Frame } from "./types";
import Utils from "./utils";

class CreateRolls<T extends number> {
  utils: Utils = new Utils();
  rolls: T[] = [];

  roll = (pins: T, firstRollPins?: T): Roll<T> => ({
    pins,
    pinsLeft: firstRollPins ? firstRollPins - pins : 10 - pins,
    strike: pins === 10,
  });

  generateRolls = (pinRounds: number): T[] => {
    let totalScores: T[] = [];

    for (let i = 0; i < pinRounds; i++) {
      const frame = this.createFrame();
      totalScores.push(...frame.scores);
      if (i === pinRounds - 1) {
        this.rolls = totalScores;
      }
    }
    return totalScores;
  };

  getFrameScore = (
    firstRoll: Roll<T>,
    secondRoll: Roll<T>,
    thirdRoll: Roll<T>
  ): Frame<T> => {
    if (firstRoll.strike) {
      // Strike
      if (secondRoll.strike) {
        if (thirdRoll.strike) {
          return {
            scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
            case: "strike",
          };
        } else {
          return {
            scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
            case: "strike",
          };
        }
      } else {
        return {
          scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
          case: "strike",
        };
      }
    } else if (firstRoll.pins + secondRoll.pins === 10) {
      // Spare
      const scores = [firstRoll.pins, secondRoll.pins, thirdRoll.pins];
      return {
        scores,
        case: "spare",
      };
    } else {
      // Open
      return {
        scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
        case: "open",
      };
    }
  };

  createFrame = (): Frame<T> => {
    const roll = (pins: T, firstRollPins?: T) => this.roll(pins, firstRollPins);
    const calculatePins = this.utils.calculatePins() as T;

    const firstRoll = () => roll(calculatePins);
    const secondRoll = (firstRoll: Roll<T>) =>
      !firstRoll.strike
        ? roll(
            this.utils.calculatePins(firstRoll.pinsLeft) as T,
            firstRoll.pinsLeft as T
          )
        : roll(calculatePins);

    const thirdRoll = () => roll(calculatePins);

    const first = firstRoll();
    const second = secondRoll(first);
    const third = thirdRoll();

    return this.getFrameScore(first, second, third);
  };
}

export default CreateRolls;
