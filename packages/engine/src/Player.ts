import type { Engine as NoaEngine, Entities, Rendering } from "noa-engine";
import {
  Color3,
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

    const px = 1.4 / 32;
    const headS = 8 * px;
    const bodyW = 8 * px;
    const bodyH = 12 * px;
    const bodyD = 4 * px;
    const limbW = 4 * px;
    const limbH = 12 * px;
    const limbD = 4 * px;

    const playerRoot = new Mesh("player_root", scene);
    playerRoot.alwaysSelectAsActiveMesh = true;

    const skinMat = new StandardMaterial("skin_mat", scene);
    const skinTexture = new Texture(
      this.texture,
      scene,
      false,
      true,
      Texture.NEAREST_SAMPLINGMODE,
    );

    skinMat.diffuseTexture = skinTexture;
    skinMat.emissiveColor = new Color3(0.4, 0.4, 0.4);

    const uvBox = (x: number, y: number, w: number, h: number) => {
      return new Vector4(
        x / 64,
        (64 - y - h) / 64,
        (x + w) / 64,
        (64 - y) / 64,
      );
    };

    

    // --- Head ---
    const headUV = [
      uvBox(8, 8, 8, 8),
      uvBox(24, 8, 8, 8),
      uvBox(0, 8, 8, 8),
      uvBox(16, 8, 8, 8),
      uvBox(8, 0, 8, 8),
      uvBox(16, 0, 8, 8),
    ];

    // --- Body ---
    const bodyUV = [
      uvBox(20, 20, 8, 12),
      uvBox(32, 20, 8, 12),
      uvBox(16, 20, 4, 12),
      uvBox(28, 20, 4, 12),
      uvBox(20, 16, 8, 4),
      uvBox(28, 16, 8, 4),
    ];

    // --- Left Arm ---
    const left_armUV = [
      uvBox(51, 20, 3, 12),
      uvBox(44, 20, 3, 12),
      uvBox(40, 20, 4, 12),
      uvBox(47, 20, 4, 12),
      uvBox(44, 16, 3, 4),
      uvBox(47, 16, 3, 4),
    ];

    // --- Right Arm ---
    const right_armUV = [
      uvBox(44, 20, 3, 12),
      uvBox(51, 20, 3, 12),
      uvBox(40, 20, 4, 12),
      uvBox(47, 20, 4, 12),
      uvBox(44, 16, 3, 4),
      uvBox(47, 16, 3, 4),
    ];

    // --- Left Leg ---
    const left_legUV = [
      uvBox(12, 20, 4, 12),
      uvBox(4, 20, 4, 12),
      uvBox(0, 20, 4, 12),
      uvBox(8, 20, 4, 12),
      uvBox(4, 16, 4, 4),
      uvBox(8, 16, 4, 4),
    ];

    // --- Right Leg ---
    const right_legUV = [
      uvBox(4, 20, 4, 12),
      uvBox(12, 20, 4, 12),
      uvBox(0, 20, 4, 12),
      uvBox(8, 20, 4, 12),
      uvBox(4, 16, 4, 4),
      uvBox(8, 16, 4, 4),
    ];

    const head = MeshBuilder.CreateBox(
      "head",
      { width: headS, height: headS, depth: headS, faceUV: headUV, wrap: true },
      scene,
    );
    const body = MeshBuilder.CreateBox(
      "body",
      { width: bodyW, height: bodyH, depth: bodyD, faceUV: bodyUV, wrap: true },
      scene,
    );
    const rightArm = MeshBuilder.CreateBox(
      "rightArm",
      {
        width: limbW,
        height: limbH,
        depth: limbD,
        faceUV: right_armUV,
        wrap: true,
      },
      scene,
    );
    const leftArm = MeshBuilder.CreateBox(
      "leftArm",
      {
        width: limbW,
        height: limbH,
        depth: limbD,
        faceUV: left_armUV,
        wrap: true,
      },
      scene,
    );
    const rightLeg = MeshBuilder.CreateBox(
      "rightLeg",
      {
        width: limbW,
        height: limbH,
        depth: limbD,
        faceUV: right_legUV,
        wrap: true,
      },
      scene,
    );
    const leftLeg = MeshBuilder.CreateBox(
      "leftLeg",
      {
        width: limbW,
        height: limbH,
        depth: limbD,
        faceUV: left_legUV,
        wrap: true,
      },
      scene,
    );

    head.material =
      body.material =
      rightArm.material =
      leftArm.material =
      rightLeg.material =
      leftLeg.material =
        skinMat;

    [head, body, rightArm, leftArm, rightLeg, leftLeg].forEach((mesh) => {
      mesh.alwaysSelectAsActiveMesh = true;
      mesh.parent = playerRoot;
    });

    leftLeg.position.set(-2 * px, limbH / 2, 0);
    rightLeg.position.set(2 * px, limbH / 2, 0);
    body.position.set(0, limbH + bodyH / 2, 0);
    leftArm.position.set(-6 * px, limbH + bodyH / 2, 0);
    rightArm.position.set(6 * px, limbH + bodyH / 2, 0);
    head.position.set(0, limbH + bodyH + headS / 2, 0);

    leftArm.setPivotPoint(new Vector3(0, limbH / 2, 0));
    rightArm.setPivotPoint(new Vector3(0, limbH / 2, 0));
    leftLeg.setPivotPoint(new Vector3(0, limbH / 2, 0));
    rightLeg.setPivotPoint(new Vector3(0, limbH / 2, 0));

    this.playerParts = { head, leftArm, rightArm, leftLeg, rightLeg };

    if (
      this.entities.hasComponent(eid, this.entities.names[EntityComponent.mesh])
    ) {
      this.entities.removeComponent(
        eid,
        this.entities.names[EntityComponent.mesh],
      );
    }
    playerRoot.rotation.y = Math.PI / 2;
    this.entities.addComponent(eid, this.entities.names[EntityComponent.mesh], {
      mesh: playerRoot,
      offset: [0, 0, 0],
    });

    [head, body, leftArm, rightArm, leftLeg, rightLeg].forEach((m) =>
      this.noa.rendering.addMeshToScene(m),
    );

    // Setting for player
    this.entities.getMovement(this.noa.playerEntity).maxSpeed = 5;
    this.entities.getMovement(this.noa.playerEntity).moveForce = 10;

    this.entities.getMovement(this.noa.playerEntity).jumpImpulse = 5;
    this.entities.getMovement(this.noa.playerEntity).airJumps = 0;

    this.noa.on("beforeRender", (dt: number) => this.animateCharacter(dt));
  }
  private animateCharacter(dt: number) {
    if (!this.playerParts.head) return;

    const eid = this.noa.playerEntity;

    this.playerParts.head.rotation.x = this.noa.camera.pitch;

    const playerRoot = this.entities.getMeshData(eid).mesh;
    if (playerRoot) {
      playerRoot.rotation.y = this.noa.camera.heading;
    }

    const body = this.entities.getPhysicsBody(eid);
    if (!body) return;

    const vx = body.velocity[0];
    const vz = body.velocity[2];
    const speed = Math.sqrt(vx * vx + vz * vz);

    if (speed > 0.5) {
      this.walkTick += dt * 0.015;
      const swing = Math.sin(this.walkTick) * 0.8;

      this.playerParts.leftArm.rotation.x = -swing;
      this.playerParts.rightArm.rotation.x = swing;
      this.playerParts.leftLeg.rotation.x = swing;
      this.playerParts.rightLeg.rotation.x = -swing;
    } else {
      this.walkTick = 0;
      this.playerParts.leftArm.rotation.x *= 0.8;
      this.playerParts.rightArm.rotation.x *= 0.8;
      this.playerParts.leftLeg.rotation.x *= 0.8;
      this.playerParts.rightLeg.rotation.x *= 0.8;
    }
  }
}
