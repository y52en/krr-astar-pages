type find = (table: string, start_x, start_y, end_x, end_y) => string;
type aStar = {
  Find: find;
};
export const AStar: aStar;
