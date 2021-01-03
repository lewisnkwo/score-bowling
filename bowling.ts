import { Roll, Frame } from "./types";

class Bowling {
  totalCount: number = 0;
  constructor(public rolls: number[]) {
    setTimeout(() => {
      this.score();
    }, 100); // To avoid incorrect values being passed in from this.rolls()
  }

  defaultReducer = (r: number[]): number =>
    r.reduce((first, second) => first + second);

  startGame = (): number => this.getTotal(this.rolls);

  getTotal = (rolls: number[]): number => {
    const ref = { ...rolls }; // Get a reference of initial rolls (due to `this.rolls` being mutable)
    let total = 0;
    let lastFrame = false;

    for (let i = 0; i < rolls.length; i++) {
      const firstRoll = i;
      const secondRoll = ref[i + 1] ? i + 1 : -1;
      const thirdRoll = ref[i + 2] ? i + 2 : -1;

      const spare =
        ref[firstRoll] + ref[secondRoll] === 10 &&
        ref[firstRoll] !== 10 &&
        ref[secondRoll] !== 10;

      const strike = ref[firstRoll] === 10;

      // If in the last frame of the game
      if (
        rolls[rolls.length - 3] + rolls[rolls.length - 2] ===
          10 /* last frame is spare */ ||
        rolls[rolls.length - 3] === 10 /* last frame is strike */
      ) {
        if (i === rolls.length - 3) {
          lastFrame = true;
        }
      } else {
        // since there are no fill balls...
        if (i === rolls.length - 2) {
          lastFrame = true;
        }
      }

      if (spare && ref[thirdRoll] !== 0 && !lastFrame) {
        rolls[thirdRoll] = rolls[thirdRoll] * 2;
        total = this.defaultReducer(rolls);
      } else if (strike) {
        // If perfect game
        if (rolls.every((r) => r === 10)) {
          total = 300;
          break;
        }

        if (lastFrame) {
          this.defaultReducer(rolls);
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

  checkGameRules = () => {};

  // roll = (pins: number, firstRollPins?: number): Roll => {
  //   return {
  //     pins,
  //     pinsLeft: firstRollPins ? firstRollPins - pins : 10 - pins,
  //     strike: pins === 10,
  //   };
  // };

  //   if (firstRoll + secondRoll === 10 && thirdRoll !== 0) {
  //     console.log(this.rolls);
  //     // TEST - points scored in the roll after a spare are counted twice
  //     rolls[2] = thirdRoll * 2;
  //     return defaultReducer(rolls);
  //   } else {
  //     return defaultReducer(rolls);
  //   }
  // };

  // getFrameScore = (
  //   firstRoll: Roll,
  //   secondRoll: Roll,
  //   thirdRoll: Roll
  // ): Frame => {
  //   if (firstRoll.strike) {
  //     // Strike
  //     if (secondRoll.strike) {
  //       if (thirdRoll.strike) {
  //         return {
  //           scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
  //           case: "strike",
  //         };
  //       } else {
  //         return {
  //           scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
  //           case: "strike",
  //         };
  //       }
  //     } else {
  //       return {
  //         scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
  //         case: "strike",
  //       };
  //     }
  //   } else if (firstRoll.pins + secondRoll.pins === 10) {
  //     // Spare
  //     const scores = [firstRoll.pins, secondRoll.pins, thirdRoll.pins];
  //     return {
  //       scores,
  //       case: "spare",
  //     };
  //   } else {
  //     // Open
  //     return {
  //       scores: [firstRoll.pins, secondRoll.pins, thirdRoll.pins],
  //       case: "open",
  //     };
  //   }
  // };

  // countTwice = (v: number) => v * 2;

  // processRules = (scores: number[], condition: string): number => {
  //   if (condition === "countTwice") {
  //     // points scored in the roll after a spare are counted twice
  //     return scores[0] + scores[1] + this.countTwice(scores[2]);
  //   } else {
  //     return scores[0] + scores[1] + scores[2];
  //   }
  // };

  // createFrame = (): Frame => {
  //   const roll = (pins: number, firstRollPins?: number) =>
  //     this.roll(pins, firstRollPins);

  //   const firstRoll = () => roll(this.calculatePins());
  //   const secondRoll = (firstRoll: Roll) => {
  //     return !firstRoll.strike
  //       ? roll(this.calculatePins(firstRoll.pinsLeft), firstRoll.pinsLeft)
  //       : roll(this.calculatePins());
  //   };
  //   const thirdRoll = () => roll(this.calculatePins());

  //   const first = firstRoll();
  //   const second = secondRoll(first);
  //   const third = thirdRoll();

  //   return this.getFrameScore(first, second, third);
  // };

  // calculatePins = (pinLimit?: number) =>
  //   pinLimit
  //     ? Math.floor(Math.random() * (pinLimit + 1))
  //     : Math.floor(Math.random() * 11);

  score = (): number => this.startGame();
}

export default Bowling;
