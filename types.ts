export type FrameCase = "open" | "spare" | "strike";

export interface Roll<T> {
  pins: T; // 'pins' as in the number of pins knocked down
  pinsLeft: number | undefined;
  strike: boolean;
}

export interface Frame<T> {
  totalValue?: number; // a collection of the number of pins knocked down from each roll
  scores: T[];
  case: FrameCase;
}
