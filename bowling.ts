type FrameCase = "open" | "spare" | "strike";

interface Roll {
  pins: number; // 'pins' as in the number of pins knocked down
  pinsLeft: number | undefined;
  strike: boolean;
}

interface Frame {
  scores: number[];
  case: FrameCase;
}

class Bowling {
  constructor(public rolls: number[]) {
    console.log(this.createFrame());
  }

  roll = (pins: number, firstRollPins?: number): Roll => {
    return {
      pins,
      pinsLeft: firstRollPins ? firstRollPins - pins : 10 - pins,
      strike: pins === 10,
    };
  };

  getScore = (
    firstRoll: Roll,
    secondRoll: Roll,
    thirdRoll: Roll
    // frameCount: number
  ): Frame => {
    const scores: number[] = [];
    scores.length = Math.min(scores.length, 2);

    console.log(firstRoll);
    console.log(secondRoll);
    console.log(thirdRoll);

    if (firstRoll.strike) {
      // Strike
      if (secondRoll.strike) {
        if (thirdRoll.strike) {
          scores.push(10);
          scores.push(10);
          return {
            scores,
            case: "strike",
          };
        } else {
          scores.push(thirdRoll.pins);
          scores.push(10);
          return {
            scores,
            case: "strike",
          };
        }
      } else {
        scores.push(10);
        scores.push(secondRoll.pins + thirdRoll.pins);
        return {
          scores,
          case: "strike",
        };
      }
    } else if (firstRoll.pins + secondRoll.pins === 10) {
      // Spare
      scores.push(10);
      scores.push(thirdRoll.pins);
      return {
        scores,
        case: "spare",
      };
    } else {
      // Open
      scores.push(firstRoll.pins);
      scores.push(secondRoll.pins);
      return {
        scores,
        case: "open",
      };
    }
  };

  calculatePins = (pinLimit?: number) =>
    pinLimit
      ? Math.floor(Math.random() * (pinLimit + 1))
      : Math.floor(Math.random() * 11);

  createFrame = (): Frame => {
    const roll = (pins: number, firstRollPins?: number) =>
      this.roll(pins, firstRollPins);

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

    return this.getScore(first, second, third);
  };

  score = (): number => {
    return this.rolls.reduce((first, second) => first + second, 0);
  };
}

export default Bowling;
