import { Roll, Frame } from "./types";

class Bowling {
  constructor(public rolls: number[]) {
    this.startGame(1);
  }

  startGame = (rounds: number) => {
    let totalScores: number[] = [];

    for (let i = 0; i < rounds; i++) {
      const frame = this.createFrame();
      const processGameRules = this.processRules(frame);
      totalScores.push(...frame.scores);
      if (i === rounds - 1) {
        this.rolls = totalScores;
        return this.rolls;
      }
    }
  };

  roll = (pins: number, firstRollPins?: number): Roll => {
    return {
      pins,
      pinsLeft: firstRollPins ? firstRollPins - pins : 10 - pins,
      strike: pins === 10,
    };
  };

  getFrameScore = (
    firstRoll: Roll,
    secondRoll: Roll,
    thirdRoll: Roll
    // frameCount: number
  ): Frame => {
    const scores: number[] = [];
    scores.length = Math.min(scores.length, 2);

    if (firstRoll.strike) {
      // Strike
      if (secondRoll.strike) {
        if (thirdRoll.strike) {
          scores.push(10);
          scores.push(10);
          return {
            rawScores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
            scores,
            case: "strike",
          };
        } else {
          scores.push(thirdRoll.pins);
          scores.push(10);
          return {
            rawScores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
            scores,
            case: "strike",
          };
        }
      } else {
        scores.push(10);
        scores.push(secondRoll.pins + thirdRoll.pins);
        return {
          rawScores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
          scores,
          case: "strike",
        };
      }
    } else if (firstRoll.pins + secondRoll.pins === 10) {
      // Spare
      scores.push(10);
      scores.push(thirdRoll.pins);
      return {
        rawScores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
        scores,
        case: "spare",
      };
    } else {
      // Open
      scores.push(firstRoll.pins);
      scores.push(secondRoll.pins);
      return {
        rawScores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
        scores,
        case: "open",
      };
    }
  };

  countTwice = (v: number) => v * 2;

  processRules = (frame: Frame): Frame => {
    console.log(frame.rawScores);
    if (frame.case === "spare") {
      // points scored in the roll after a spare are counted twice
      const countScore =
        frame.rawScores[0] +
        frame.rawScores[1] +
        this.countTwice(frame.rawScores[2]);
      frame.totalValue = countScore;
      console.log(countScore);

      return frame;
    } else {
      return frame;
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

    return this.getFrameScore(first, second, third);
  };

  score = (): number => {
    return this.rolls.reduce((first, second) => {
      // points scored in the roll after a spare are counted twice
      return first + second;
    }, 0);
  };
}

export default Bowling;
