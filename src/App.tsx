import React from "react";
import "./App.css";
/* @vite-ignore */
import { aStar } from "./AppBundle/astar.js";
import { Main } from "./view/main";

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [astar, setAStar] = React.useState<aStar | null>(null);
  (async () => {
    setAStar((await import("./AppBundle/astar.js")).AStar);
    setIsLoading(false);
  })();
  return <>{isLoading ? "Loading..." : <Main astar={astar!} />}</>;
}

export default App;
