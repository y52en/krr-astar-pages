import { useEffect, useState } from "react";
import { Cell, ChooseMode, Path, Room, Table } from "../types";

type Props = {
  x: number;
  y: number;
  table: Table;
  chooseMode: ChooseMode;
  onUpdate: (room: Room) => void;
};

export function RoomTable(props: Props) {
  const [room, setRoom] = useState<Room>({
    start: [0, 0],
    end: [props.x - 1, props.y - 1],
    table: new Array(props.x)
      .fill(0)
      .map(() => new Array(props.y).fill(Cell.Empty)),
  });
  useEffect(() => {
    props.onUpdate(room);
  }, []);
  return (
    <table>
      <tbody>
        {Array.from({ length: props.y }).map((_, y) => (
          <tr key={y}>
            {Array.from({ length: props.x }).map((_, x) => (
              <td
                key={x}
                className={
                  `square-table ${
                    props.chooseMode === "start"
                      ? "border-red"
                      : props.chooseMode === "end"
                      ? "border-green"
                      : "border-default"
                  } ${
                    room.table[x][y] === Cell.Wall ? "cell-black" : "cell-white"
                  }`
                }
                onClick={() => {
                  const newRoom = { ...room };
                  if (props.chooseMode === "start") {
                    newRoom.start = [x, y];
                  } else if (props.chooseMode === "end") {
                    newRoom.end = [x, y];
                  } else if (props.chooseMode === "wall") {
                    newRoom.table[x][y] =
                      newRoom.table[x][y] === 1 ? Cell.Wall : Cell.Empty;
                  }
                  setRoom(newRoom);
                  props.onUpdate(newRoom);
                }}
              >
                {(() => {
                  if (room.start[0] === x && room.start[1] === y) {
                    return "😶";
                  } 
                })()}
                {(() => {
                  if (room.end[0] === x && room.end[1] === y) {
                    return "🚩";
                  } 
                })()}
                {props.table[x][y] !== -1 ? props.table[x][y] : ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
