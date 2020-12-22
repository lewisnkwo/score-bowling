export type FrameCase = "open" | "spare" | "strike";

export interface Roll {
  pins: number; // 'pins' as in the number of pins knocked down
  pinsLeft: number | undefined;
  strike: boolean;
}

export interface Frame {
  scores: number[];
  case: FrameCase;
}
