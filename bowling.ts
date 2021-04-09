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

  checkIfLastFrame = (rolls: number[], i: number) => {
    const thirdToLastRoll = rolls.length - 3;
    const secondToLastRoll = rolls.length - 2;
    if (
      rolls[thirdToLastRoll] + rolls[secondToLastRoll] ===
        10 /* last frame is spare */ ||
      rolls[thirdToLastRoll] === 10 /* last frame is strike */
    ) {
      if (i === thirdToLastRoll) {
        this.isLastFrame = true;
        this.lastFrame = rolls.slice(-3);
      } else {
        this.isLastFrame = false;
        this.lastFrame = [];
      }
    } else {
      if (i === secondToLastRoll) {
        this.isLastFrame = true;
        this.lastFrame = rolls.slice(-2);
      } else {
        this.isLastFrame = false;
        this.lastFrame = [];
      }
    }
  };

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

      this.checkIfLastFrame(rolls, i);

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
    const isIncorrectPinCount = (r: number[]): boolean => {
      let decision: boolean = false;
      for (let i = 0; i < r.length - 1; i++) {
        const firstRoll = r[i];
        const secondRoll = r[i + 1];
        const firstPreviousRoll = r[i - 1];

        const currentFrame = [firstRoll, secondRoll];
        this.checkIfLastFrame(r, i);
        if (this.isLastFrame) {
          const lastFrame = this.lastFrame;

          const currentRoll = lastFrame[0];
          const rollOne = lastFrame[1];
          const rollTwo = lastFrame[2];

          if (lastFrame.length === 3) {
            if (!lastFrame.every((r) => r === 10)) {
              if (rollTwo === 10) {
                if (currentRoll + rollOne === 10) {
                  decision = false;
                  break;
                }
                decision = true;
                break;
              }
            }
          }
        }

        if (
          this.utils.defaultReducer(currentFrame) > 10 &&
          firstRoll !== 10 &&
          secondRoll !== 10 &&
          firstPreviousRoll + firstRoll !== 10
        ) {
          decision = true;
          break;
        }
      }
      return decision;
    };

    const checkIfScoresMissing = (r: number[]): boolean => {
      const lastFrame = r.slice(-3);

      if (
        lastFrame[0] + lastFrame[1] === 10 &&
        lastFrame[0] !== 10 &&
        lastFrame[1] !== 10 &&
        lastFrame[2] > 0
      ) {
        // if first two rolls in last frame is a spare and last roll is a strike
        return false;
      } else if (r === [] || r.length < 12) {
        return true;
      } else if (
        lastFrame[0] !== 10 &&
        lastFrame[1] === 10 &&
        lastFrame[2] === 10
      ) {
        // both bonus rolls for a strike in the last frame must be rolled before score can be calculated
        return true;
      } else if (lastFrame[0] === 0 && lastFrame[1] + lastFrame[2] === 10) {
        // bonus roll for a spare in the last frame must be rolled before score can be calculated
        return true;
      } else if (
        lastFrame[0] !== 10 &&
        lastFrame[1] !== 10 &&
        lastFrame[2] === 10
      ) {
        // bonus rolls for a strike in the last frame must be rolled before score can be calculated
        return true;
      }
      return false;
    };

    const isGameUnfinished = (r: number[]): boolean =>
      r.length > 20 &&
      this.isLastFrame &&
      this.lastFrame.every((r) => typeof r === "number") && // if rolls are defined
      this.lastFrame[0] + this.lastFrame[1] !== 10; // if a spare exists in last frame, ignore rule

    if (!r.every((r) => r >= 0 && r <= 10)) {
      throw new Error("Pins must have a value from 0 to 10");
    } else if (isIncorrectPinCount(r)) {
      throw new Error("Pin count exceeds pins on the lane");
    } else if (checkIfScoresMissing(r)) {
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
