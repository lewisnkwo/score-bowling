import Utils from "./utils";

export default class Bowling<T extends number> {
  utils: Utils = new Utils();
  isLastFrame: boolean = false;
  lastFrame: number[] = [];

  constructor(public rolls: T[]) {
    setTimeout(() => {
      this.score();
    }, 100);
  }

  getTotal = (rolls: number[]): number => {
    const ref = { ...rolls }; // Get a reference of initial rolls (due to `this.rolls` being mutable)
    let total = 0;

    for (let i = 0; i < rolls.length - 2; i++) {
      const firstRoll = i;
      const secondRoll = ref[i + 1] ? i + 1 : -1;
      const thirdRoll = ref[i + 2] ? i + 2 : -1;

      const isSpare =
        ref[firstRoll] + ref[secondRoll] === 10 &&
        ref[firstRoll] !== 10 &&
        ref[secondRoll] !== 10;

      const isStrike = ref[firstRoll] === 10;

      const frame = this.utils.checkIfLastFrame(rolls, i);
      this.isLastFrame = frame.isLastFrame;
      this.lastFrame = frame.lastFrame;

      // If perfect game
      if (rolls.every((r) => r === 10)) {
        total = 300;
        break;
      }

      if (isSpare && ref[thirdRoll] !== 0 && !this.isLastFrame) {
        rolls[thirdRoll] = rolls[thirdRoll] * 2;
        total = this.utils.defaultReducer(rolls);
      } else if (isStrike) {
        if (this.isLastFrame) {
          const lastFrame = this.lastFrame;
          if (lastFrame.length === 3) {
            const currentRoll = lastFrame[0];
            const rollOne = lastFrame[1];

            if (currentRoll + rollOne === 10) {
              total = this.utils.defaultReducer(rolls);
            }
          }
        } else if (ref[secondRoll] === 10) {
          rolls[firstRoll] =
            rolls[firstRoll] + rolls[secondRoll] + rolls[thirdRoll];
          total = this.utils.defaultReducer(rolls);
        } else {
          rolls[secondRoll] = rolls[secondRoll] * 2;
          rolls[thirdRoll] = rolls[thirdRoll] * 2;
          total = this.utils.defaultReducer(rolls);
        }
      } else {
        total = this.utils.defaultReducer(rolls);
      }
    }

    return total;
  };

  checkGameRules = (r: number[]): number => {
    const isGameUnfinished = (r: number[]): boolean =>
      r.length > 20 &&
      this.isLastFrame &&
      this.lastFrame.every((r) => typeof r === "number") && // if rolls are defined
      this.lastFrame[0] + this.lastFrame[1] !== 10; // if a spare exists in last frame, ignore rule

    if (!r.every((r) => r >= 0 && r <= 10)) {
      throw new Error("Pins must have a value from 0 to 10");
    } else if (this.utils.isIncorrectPinCount(r)) {
      throw new Error("Pin count exceeds pins on the lane");
    } else if (this.utils.checkIfScoresMissing(r)) {
      throw new Error("Score cannot be taken until the end of the game");
    } else if (isGameUnfinished(r)) {
      throw new Error("Should not be able to roll after game is over");
    } else return this.getTotal(this.rolls);
  };

  score = (): number => {
    try {
      return this.checkGameRules(this.rolls);
    } catch (e) {
      throw new Error(e);
    }
  };
}
