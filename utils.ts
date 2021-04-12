import { LastFrame } from "./types";

class Utils {
  defaultReducer = (r: number[]): number =>
    r.reduce((first, second) => first + second);

  calculatePins = (pinLimit?: number): number =>
    pinLimit
      ? Math.floor(Math.random() * (pinLimit + 1))
      : Math.floor(Math.random() * 11);

  checkIfLastFrame = (rolls: number[], i: number): LastFrame => {
    const thirdToLastRoll = rolls.length - 3;
    const secondToLastRoll = rolls.length - 2;
    const frame: LastFrame = {
      isLastFrame: false,
      lastFrame: [],
    };

    if (
      rolls[thirdToLastRoll] + rolls[secondToLastRoll] ===
        10 /* last frame is spare */ ||
      rolls[thirdToLastRoll] === 10 /* last frame is strike */
    ) {
      if (i === thirdToLastRoll) {
        frame.isLastFrame = true;
        frame.lastFrame = rolls.slice(-3);
      } else {
        frame.isLastFrame = false;
        frame.lastFrame = [];
      }
    } else {
      if (i === secondToLastRoll) {
        frame.isLastFrame = true;
        frame.lastFrame = rolls.slice(-2);
      } else {
        frame.isLastFrame = false;
        frame.lastFrame = [];
      }
    }

    return frame;
  };

  isIncorrectPinCount = (r: number[]): boolean => {
    let decision: boolean = false;
    for (let i = 0; i < r.length - 1; i++) {
      const firstRoll = r[i];
      const secondRoll = r[i + 1];
      const firstPreviousRoll = r[i - 1];

      const currentFrame = [firstRoll, secondRoll];
      const frame = this.checkIfLastFrame(r, i);

      if (frame.isLastFrame) {
        const currentRoll = frame.lastFrame[0];
        const rollOne = frame.lastFrame[1];
        const rollTwo = frame.lastFrame[2];

        if (frame.lastFrame.length === 3) {
          if (!frame.lastFrame.every((r) => r === 10)) {
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

  checkIfScoresMissing = (r: number[]): boolean => {
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
}

export default Utils;
