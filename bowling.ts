class Bowling {
  totalCount: number = 0;
  isLastFrame: boolean = false;
  lastFrame: number[] = [];

  constructor(public rolls: number[]) {
    setTimeout(() => {
      this.score();
    }, 100); // To avoid incorrect values being passed in from this.rolls()
  }

  defaultReducer = (r: number[]): number =>
    r.reduce((first, second) => first + second);

  startGame = (): number => this.getTotal(this.rolls);

  checkIfLastFrame = (r: number[], i: number) => {
    if (
      r[r.length - 3] + r[r.length - 2] === 10 /* last frame is spare */ ||
      r[r.length - 3] === 10 /* last frame is strike */
    ) {
      if (i === r.length - 3) {
        this.isLastFrame = true;
        this.lastFrame = r.slice(-3);
      } else {
        this.isLastFrame = false;
        this.lastFrame = [];
      }
    } else {
      // since there are no fill balls...
      if (i === r.length - 2) {
        this.isLastFrame = true;
        this.lastFrame = r.slice(-2);
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

      const spare =
        ref[firstRoll] + ref[secondRoll] === 10 &&
        ref[firstRoll] !== 10 &&
        ref[secondRoll] !== 10;

      const strike = ref[firstRoll] === 10;

      this.checkIfLastFrame(rolls, i);

      // If perfect game
      if (rolls.every((r) => r === 10)) {
        total = 300;
        break;
      }

      if (spare && ref[thirdRoll] !== 0 && !this.isLastFrame) {
        rolls[thirdRoll] = rolls[thirdRoll] * 2;
        total = this.defaultReducer(rolls);
      } else if (strike) {
        if (this.isLastFrame) {
          const lastFrame = this.lastFrame;
          if (lastFrame.length === 3) {
            const currentRoll = lastFrame[0];
            const rollOne = lastFrame[1];

            if (currentRoll + rollOne === 10) {
              total = this.defaultReducer(rolls);
            }
          }
        } else if (ref[secondRoll] === 10) {
          rolls[firstRoll] =
            rolls[firstRoll] + rolls[secondRoll] + rolls[thirdRoll];
          total = this.defaultReducer(rolls);
        } else {
          rolls[secondRoll] = rolls[secondRoll] * 2;
          rolls[thirdRoll] = rolls[thirdRoll] * 2;
          total = this.defaultReducer(rolls);
        }
      } else {
        total = this.defaultReducer(rolls);
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
          this.defaultReducer(currentFrame) > 10 &&
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

    if (!r.every((r) => r >= 0 && r <= 10)) {
      throw new Error("Pins must have a value from 0 to 10");
    } else if (isIncorrectPinCount(r)) {
      throw new Error("Pin count exceeds pins on the lane");
    } else if (r === [] || r.length < 12) {
      throw new Error("Score cannot be taken until the end of the game");
    } else if (
      r.length > 20 &&
      this.isLastFrame &&
      this.lastFrame.every((r) => typeof r === "number") && // if rolls are defined
      this.lastFrame[0] + this.lastFrame[1] !== 10 // if a spare exists in last ignore, ignore rule
    ) {
      throw new Error("Should not be able to roll after game is over");
    } else return this.startGame();
  };

  score = (): number => {
    try {
      return this.checkGameRules(this.rolls);
    } catch (e) {
      throw new Error(e);
    }
  };
}

export default Bowling;
