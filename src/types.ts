export type Table = Cell[][];
export interface Room {
  start: Vector2;
  end: Vector2;
  table: Table;
}

export const Cell = {
  NoShow: -1,
  Wall : 0,
  Empty : 1,
} as const;

export type Cell = typeof Cell[keyof typeof Cell];

export type Vector2 = [number, number];
export type Path = Vector2[];

export type ChooseMode = "start" | "end" | "wall";
