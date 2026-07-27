import { Engine as NoaEngine } from "noa-engine";
import type { World } from "noa-engine";

import type { EngineOptions } from "./types/engineconfig";

import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Shaders/postprocess.vertex.js";
import "@babylonjs/core/Shaders/rgbdDecode.fragment.js";
import { Player } from "./Player";
import { UI } from "./UI";
import { Input } from "./Input";
import { Map } from "./Map";
import { GameResources } from "./types/block";

export class Engine {
  private noa: NoaEngine;

  constructor({
    isDebug = false,
    config,
  }: {
    isDebug: boolean;
    config?: EngineOptions | undefined;
  }) {
    this.noa = new NoaEngine(
      config ?? {
        debug: true,
        inverseY: false,
        showFPS: false,
        inverseX: false,
        chunkSize: 16,
        chunkAddDistance: [3, 2],
        blockTestDistance: 50,
        playerStart: [0.5, 5, 0.5],
        playerHeight: 1.8,
        playerWidth: 0.6,
        useAO: true,
        AOmultipliers: [0.92, 0.8, 0.5],
        reverseAOmultipliers: 1.0,
        manuallyControlChunkLoading: false,
        originRebaseDistance: 10,
      },
    );
    this.noa.camera.zoomDistance = 0;
  }
  public init(json_blocks: GameResources) {
    // Player
    const player = new Player(this.noa);
    player.init();

    //UI
    const ui = new UI(this.noa);
    ui.init();
    ui.initListeners();
    ui.drawHUD();

    // Inputs
    const inputs = new Input(this.noa);
    inputs.init();
    inputs.sprint();

    // Map
    const map = new Map(this.noa);
    map.init(json_blocks);
  }
}
