import { Engine } from "@projectgame-227/engine";
import { useEffect } from "react";

import assets from "./assets/assets.json";

const App = () => {
  useEffect(() => {
    const game = new Engine({
      isDebug: true,
    });
    game.init(assets);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div className="crosshair">+</div>
    </div>
  );
};
export default App;
