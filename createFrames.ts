import { Roll, Frame } from "./types";
import Bowling from "./bowling";

class CreateFrames {
  private scoreBowling: Bowling = new Bowling([]);

  getFrameScore = (
    firstRoll: Roll,
    secondRoll: Roll,
    thirdRoll: Roll
  ): Frame => {
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

  createFrame = (): Frame => {
    const roll = (pins: number, firstRollPins?: number) =>
      this.scoreBowling.roll(pins, firstRollPins);

    const firstRoll = () => roll(this.calculatePins());
    const secondRoll = (firstRoll: Roll) => {
      return !firstRoll.strike
        ? roll(this.calculatePins(firstRoll.pinsLeft), firstRoll.pinsLeft)
        : roll(this.calculatePins());
    };
    const thirdRoll = () => roll(this.calculatePins());

    const first = firstRoll();
    const second = secondRoll(first);
    const third = thirdRoll();

    return this.getFrameScore(first, second, third);
  };

  calculatePins = (pinLimit?: number) =>
    pinLimit
      ? Math.floor(Math.random() * (pinLimit + 1))
      : Math.floor(Math.random() * 11);
}

export default CreateFrames;
