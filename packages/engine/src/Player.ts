import type { Engine as NoaEngine, Entities, Rendering } from "noa-engine";
import {
  Color3,
  CreateBox,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
} from "@babylonjs/core";

export const EntityComponent = {
  collideEntities: "collideEntities",
  collideTerrain: "collideTerrain",
  fadeOnZoom: "fadeOnZoom",
  followsEntity: "followsEntity",
  mesh: "mesh",
  movement: "movement",
  physics: "physics",
  position: "position",
  receivesInputs: "receivesInputs",
  shadow: "shadow",
  smoothCamera: "smoothCamera",
} as const;

export class Player {
  private rendering: Rendering;
  private entities: Entities;
  private noa: NoaEngine;
  private texture: string;
  private playerParts: Record<string, Mesh> = {};
  private walkTick: number = 0;

  constructor(engine: NoaEngine, texture?: string) {
    this.noa = engine;
    this.rendering = engine.rendering;
    this.entities = engine.entities;
    this.texture = texture ?? "";
  }

  public init() {
    const scene = this.rendering.getScene();
    const eid = this.noa.playerEntity;
    const meshComp = this.entities.names[EntityComponent.mesh];

    const capsule = MeshBuilder.CreateCapsule(
      "player",
      { height: 1.8, radius: 0.4 },
      scene,
    );
    capsule.alwaysSelectAsActiveMesh = true;
    capsule.rotation.y = Math.PI / 2;

    const skinMat = new StandardMaterial("skin_mat", scene);
    skinMat.diffuseColor = new Color3(196, 154, 108); 
    skinMat.emissiveColor = new Color3(0.1, 0.3, 0.5);
    capsule.material = skinMat;

    if (this.entities.hasComponent(eid, meshComp)) {
      this.entities.removeComponent(eid, meshComp);
    }

    this.entities.addComponent(eid, meshComp, {
      mesh: capsule,
      offset: [0, 0.9, 0],
    });

    Object.assign(this.entities.getMovement(eid), {
      maxSpeed: 5,
      moveForce: 10,
      jumpImpulse: 5,
      airJumps: 0,
    });
  }
  public playerAttack() {
    if (this.playerParts.leftArm) {
      console.log(this.playerParts.leftArm.rotation.x);
      this.playerParts.leftArm.rotation.z = 0.2;
      this.playerParts.leftArm.rotation.x = -1;
    }
  }
}
