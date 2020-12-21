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

  roll = (pins: number): Roll => {
    return {
      pins,
      pinsLeft: pins < 10 ? 10 - pins : undefined,
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

    if (firstRoll.strike) {
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
      scores.push(10);
      scores.push(thirdRoll.pins);
      return {
        scores,
        case: "spare",
      };
    } else {
      scores.push(firstRoll.pins);
      scores.push(secondRoll.pins);
      return {
        scores,
        case: "open",
      };
    }
  };

  createFrame = (): Frame => {
    const randomPins = (pinLimit?: number) =>
      pinLimit
        ? Math.floor(Math.random() * (pinLimit + 1))
        : Math.floor(Math.random() * 11);

    const roll = (pins: number) => this.roll(pins);

    const firstRoll = () => roll(randomPins());

    const secondRoll = (firstRoll: Roll) =>
      !firstRoll.strike
        ? roll(randomPins(firstRoll.pinsLeft))
        : roll(randomPins());

    const thirdRoll = () => roll(randomPins());

    const scores = this.getScore(
      firstRoll(),
      secondRoll(firstRoll()),
      thirdRoll()
    );

    return scores;
  };

  score = (): number => {
    return this.rolls.reduce((first, second) => first + second, 0);
  };
}

export default Bowling;
