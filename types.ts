export type FrameCase = "open" | "spare" | "strike";

export interface Roll {
  pins: number; // 'pins' as in the number of pins knocked down
  pinsLeft: number | undefined;
  strike: boolean;
}

export interface Frame {
  rawScores: number[];
  totalValue?: number; // a collection of the number of pins knocked down from each roll
  scores: number[];
  case: FrameCase;
}
