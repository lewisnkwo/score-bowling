import { Roll, Frame } from "./types";

class Bowling {
  totalCount: number = 0;
  constructor(public rolls: number[]) {
    setTimeout(() => {
      this.score();
    }, 100); // To avoid incorrect values being passed in from this.rolls()
  }

  defaultReducer = (r: number[]): number => {
    return r.reduce((first, second) => {
      return first + second;
    });
  };

  strikeReducer = (r: number[], startFrom: number): number => {
    r = r.splice(startFrom, 3);
    return this.defaultReducer(r);
  };

  startGame = (): number => this.getTotal(this.rolls);

  getTotal = (rolls: number[]): number => {
    const init = { ...rolls }; // Get a copy of initial rolls
    let subTotal = 0;
    let total = 0;
    let lastFrame = false;

    // **Rule** points scored in the roll after a spare are counted twice
    // **Rule** consecutive spares each get a one roll bonus
    // **Rule** should allow fill ball when the last frame is a spare
    // **Rule** a strike earns ten points in a frame with a single roll
    // **Rule** points scored in the two rolls after a strike are counted twice as a bonus

    for (let i = 0; i < rolls.length; i += 2) {
      const firstRoll = i;
      const secondRoll = i + 1;
      const thirdRoll = i + 2;

      const spare = init[firstRoll] + init[secondRoll] === 10;
      const strike = init[firstRoll] === 10;

      if (i === 18) {
        lastFrame = true;
      }

      if (spare && init[thirdRoll] !== 0 && !lastFrame) {
        rolls[thirdRoll] = rolls[thirdRoll] * 2;
        total = this.defaultReducer(rolls);
      }

      // **Rule** should be able to score multiple strikes in a row
      if (strike) {
        if (init[secondRoll] === 10) {
          subTotal += this.strikeReducer(rolls, firstRoll);
          console.log(subTotal);
        } else {
          rolls[secondRoll] = rolls[secondRoll] * 2;
          rolls[thirdRoll] = rolls[thirdRoll] * 2;
          total = this.defaultReducer(rolls);
        }
      }

      total = this.defaultReducer(rolls);
    }
    return total;
  };

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
