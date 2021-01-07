import { Roll, Frame } from "./types";
import Utils from "./utils";

class CreateRolls {
  private utils: Utils = new Utils();
  public rolls: number[] = [];

  public roll = (pins: number, firstRollPins?: number): Roll => {
    return {
      pins,
      pinsLeft: firstRollPins ? firstRollPins - pins : 10 - pins,
      strike: pins === 10,
    };
  };

  public generateRolls = (pinRounds: number): number[] => {
    let totalScores: number[] = [];

    for (let i = 0; i < pinRounds; i++) {
      const frame = this.createFrame();
      totalScores.push(...frame.scores);
      if (i === pinRounds - 1) {
        this.rolls = totalScores;
      }
    }
    return totalScores;
  };

  private getFrameScore = (
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

  private createFrame = (): Frame => {
    const roll = (pins: number, firstRollPins?: number) =>
      this.roll(pins, firstRollPins);

    const firstRoll = () => roll(this.utils.calculatePins());
    const secondRoll = (firstRoll: Roll) => {
      return !firstRoll.strike
        ? roll(this.utils.calculatePins(firstRoll.pinsLeft), firstRoll.pinsLeft)
        : roll(this.utils.calculatePins());
    };
    const thirdRoll = () => roll(this.utils.calculatePins());

    const first = firstRoll();
    const second = secondRoll(first);
    const third = thirdRoll();

    return this.getFrameScore(first, second, third);
  };
}

export default CreateRolls;
