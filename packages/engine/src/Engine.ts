import { Engine as NoaEngine } from "noa-engine";
import type { World } from "noa-engine";

import type { EngineOptions } from "./types/engineconfig";
import type { GameResources } from "./types/block";

import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Shaders/postprocess.vertex.js";
import "@babylonjs/core/Shaders/rgbdDecode.fragment.js";

export class Engine {
  private noa: NoaEngine;
  private config: EngineOptions | undefined;
  private blockIDs: Record<string, number> = {};
  private isDebug: boolean;
  private world: World;

  constructor(isDebug: boolean = false) {
    this.noa = new NoaEngine(
      this.config ?? {
        debug: true,
        inverseY: false,
        showFPS: false,
        inverseX: false,
        chunkSize: 16,
        chunkAddDistance: [3, 2],
        blockTestDistance: 50,
        playerStart: [0.5, 5, 0.5],
        playerHeight: 1.4,
        playerWidth: 0.6,
        playerAutoStep: true,
        playerShadowComponent: false,
        useAO: true,
        AOmultipliers: [0.92, 0.8, 0.5],
        reverseAOmultipliers: 1.0,
        manuallyControlChunkLoading: false,
        originRebaseDistance: 10,
        lightVector: [0.6, -1, -0.4],
      },
    );
    this.isDebug = isDebug;
    this.world = this.noa.world;
    this.noa.camera.zoomDistance = 0.1;
  }

  public loadResourcesFromJson(data: GameResources) {
    data.materials.forEach((mat, i) => {
      const { name, ...matOptions } = mat;
      this.noa.registry.registerMaterial(name, {
        color: matOptions.color!,
        texHasAlpha: matOptions.texHasAlpha!,
        textureURL: matOptions.textureURL!,
        renderMaterial: null,
        atlasIndex: mat.atlasIndex!,
      });
    });

    let currentBlockId = 1;
    data.blocks.forEach((block) => {
      const { name, ...blockOptions } = block;
      const id = this.noa.registry.registerBlock(currentBlockId, blockOptions);
      this.blockIDs[name] = id;
      currentBlockId++;
    });
    if (this.isDebug)
      console.log("Resource loaded successfully!", this.blockIDs);
  }

  public loadMap() {
    this.world.on(
      "worldDataNeeded",
      (id: string, data: any, _cx: number, cy: number, _cz: number) => {
        const width = data.shape[0];
        const height = data.shape[1];
        const depth = data.shape[2];

        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            for (let z = 0; z < depth; z++) {
              const worldY = cy + y;
              if (worldY <= 0) {
                data.set(x, y, z, 2);
              }
            }
          }
        }
        this.world.setChunkData(id, data);
      },
    );
    // this.noa.on("targetBlockChanged", (b) => {
    //   console.log(b)
    // })
  }

  public onMouse() {
    this.noa.inputs.down.on("fire", () => {
      if (this.noa.targetedBlock) {
        const pos = this.noa.targetedBlock.position;
        this.noa.setBlock(0, pos[0], pos[1], pos[2]);
      }
    });
  }
}
