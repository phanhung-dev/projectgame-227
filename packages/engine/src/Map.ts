import { Engine as NoaEngine } from "noa-engine";
import { GameResources } from "./types/block";
import { Color3, CubeTexture, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";

export class Map {
  private blockIDs: Record<string, number> = {};
  constructor(private noa: NoaEngine) {}

  public init(json_blocks: GameResources) {
    this.load_resources(json_blocks);
    this.register_resources(json_blocks);
    this.loadMap();
  }

  private load_resources(json_blocks: GameResources) {
    json_blocks.materials.forEach((mat, i) => {
      const { name, ...matOptions } = mat;
      this.noa.registry.registerMaterial(name, {
        color: matOptions.color!,
        texHasAlpha: matOptions.texHasAlpha!,
        textureURL: matOptions.textureURL!,
        renderMaterial: null,
        atlasIndex: mat.atlasIndex!,
      });
    });
  }
  private register_resources(json_blocks: GameResources) {
    let currentBlockId = 1;
    json_blocks.blocks.forEach((block) => {
      const { name, ...blockOptions } = block;
      const id = this.noa.registry.registerBlock(currentBlockId, blockOptions);
      this.blockIDs[name] = id;
      currentBlockId++;
    });
  }
  private loadMap() {
    this.noa.world.on(
      "worldDataNeeded",
      (id: string, data: any, cx: number, cy: number, cz: number) => {
        for (let x = 0; x < data.shape[0]; x++) {
          for (let y = 0; y < data.shape[1]; y++) {
            for (let z = 0; z < data.shape[2]; z++) {
              const worldX = cx + x;
              const worldY = cy + y;
              const worldZ = cz + z;

              if (worldX === 0 && worldY === 0 && worldZ === 0) {
                data.set(x, y, z, 2);
              } else {
                // data.set(x, y, z, 2);
              }
            }
          }
        }
        this.noa.world.setChunkData(id, data);
      },
    );
  }
}
