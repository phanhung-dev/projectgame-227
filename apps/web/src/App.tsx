import { Engine, Player, UI } from "@projectgame-227/engine";
import { useEffect } from "react";

import assets from "./assets/assets.json"


const App = () => {
  useEffect(() => {
    const game = new Engine(true);
    game.loadResourcesFromJson(assets);
    game.loadMap();
    game.onMouse();
    const player = new Player((game as any).noa, "./src/assets/skin.png");
    player.init();
    const ui = new UI((game as any).noa);
    ui.init();
    ui.initListeners();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}></div>
  );
};
export default App;
