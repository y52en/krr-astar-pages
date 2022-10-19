import React, { useEffect } from "react";
import { aStar } from "../../public/assets/astar.js";
import { RoomTable } from "../components/table";
import { Cell, ChooseMode, Path, Room, Table, Vector2 } from "../types";

const X = 9;
const Y = 9;

export function Main(props: { astar: aStar }) {
  function wrapAStar(arr: Table, start: Vector2, end: Vector2): Path {
    let input_str = "";
    for (let i = 0; i < X; i++) {
      for (let j = 0; j < Y; j++) {
        input_str += arr[i][j];
      }
    }
    const csv = props.astar
      .Find(input_str, start[0], start[1], end[0], end[1])
      .trim();
    const out = csv.split("\n").map((x) => x.split(",").map((y) => Number(y)));
    return out as Path;
  }
  const _path = new Array(X)
    .fill(0)
    .map(() => new Array(Y).fill(Cell.NoShow)) as Table;
  const [path, setPath] = React.useState(_path);
  const [chooseMode, setChooseMode] = React.useState<ChooseMode>("wall");
  const [pathMode, setPathMode] = React.useState(true);
  const [error, setError] = React.useState<boolean>(false);
  const [room, setRoom] = React.useState<Room>({} as Room);
  const CauseError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 1000);
  };
  const onUpdate = (room_: Room = room) => {
    if (Object.keys(room_).length === 0) return;
    setRoom(room_);
    const _path = new Array(X)
      .fill(0)
      .map(() => new Array(Y).fill(Cell.NoShow)) as Table;
    if (pathMode) {
      let tmp;
      try {
        tmp = wrapAStar(room_.table, room_.start, room_.end);
      } catch {
        CauseError();
        console.log(room_, 1);
        return;
      }
      tmp.forEach((x, i) => {
        // XXX: Cellではない
        _path[x[0]][x[1]] = (i + 1) as Cell;
      });
      setPath(_path);
    } else {
      for (let i = 0; i < X; i++) {
        for (let j = 0; j < Y; j++) {
          let tmp;
          try {
            tmp = wrapAStar(room_.table, room_.start, [i, j]);
          } catch (e) {
            CauseError();
            console.log(room_, 2);

            return;
          }
          tmp.forEach((x) => {
            // XXX: Cellではない
            if (_path[x[0]][x[1]] === Cell.NoShow) {
              _path[x[0]][x[1]] = 0;
            }
            _path[x[0]][x[1]]++;
          });
        }
      }
      setPath(_path);
    }
  };

  useEffect(() => {
    onUpdate();
  }, [pathMode]);

  return (
    <div>
      <div>
        <h1> {error ? "エラー！" : "ルーム経路"}</h1>
        <div>
          <button className="btn m-3" onClick={() => setChooseMode("start")}>
            スタート地点選択{chooseMode === "start" ? "中" : ""}
          </button>
          <button className="btn m-3" onClick={() => setChooseMode("end")}>
            ゴール地点選択{chooseMode === "end" ? "中" : ""}
          </button>
          <br />
          <button className="btn m-3" onClick={() => setChooseMode("wall")}>
            地形編集{chooseMode === "wall" ? "中" : ""}
          </button>
        </div>
      </div>
      <div style={{ paddingTop: "14px", paddingBottom: "14px" }}>
        <RoomTable
          x={X}
          y={Y}
          table={path}
          chooseMode={chooseMode}
          onUpdate={onUpdate}
        />
      </div>
      <div>
        <button
          className="btn m-3"
          onClick={() => {
            setPathMode(!pathMode);
          }}
        >
          現在のモード : {pathMode ? "経路表示" : "セルを通過する回数表示"}
        </button>
      </div>
      <div className="m-3">
        「セルを通過する回数表示」モードでは、
        <br />
        ゴール地点の設定は無視されます
        <br />
        <table className="display-inline">
          <tbody>
            <tr>
              <td>&emsp;</td>
              <td>X</td>
              <td>→</td>
            </tr>
            <tr>
              <td>Y</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>↓</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
