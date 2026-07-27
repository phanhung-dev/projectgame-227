declare module "noa-engine" {
  import { EventEmitter } from "events";
  import {
    Scene,
    Mesh,
    Light,
    Camera as BabylonCamera,
    Material,
    TransformNode,
  } from "@babylonjs/core";

  export type Vec3 = number[] | Float32Array;

  export class Engine extends EventEmitter {
    version: string;
    worldName: string;
    timeScale: number;
    tickRate: number;
    maxRenderRate: number;

    container: Container;
    inputs: GameInputs;
    registry: Registry;
    world: World;
    rendering: Rendering;
    physics: Physics;
    entities: Entities;
    ents: any;
    playerEntity: number;
    camera: Camera;
    targetedBlock: {
      blockID: number;
      position: Vec3;
      normal: Vec3;
      adjacent: Vec3;
    } | null;

    constructor(opts?: any);
    setPaused(paused: boolean): void;
    getBlock(x: number, y: number, z: number): number;
    setBlock(id: number, x: number, y: number, z: number): void;
    addBlock(id: number, x: number, y: number, z: number): void;
    globalToLocal(globalPos: Vec3): Vec3;
    localToGlobal(localPos: Vec3): Vec3;
    pick(
      pos: Vec3,
      dir: Vec3,
      dist: number,
    ): { position: Vec3; normal: Vec3; _localPosition: Vec3 } | null;

    on(event: "tick", listener: (dt: number) => void): this;
    on(event: "beforeRender", listener: (dt: number) => void): this;
    on(event: "afterRender", listener: (dt: number) => void): this;
    on(
      event: "targetBlockChanged",
      listener: (
        block: {
          blockID: number;
          position: Vec3;
          normal: Vec3;
          adjacent: Vec3;
        } | null,
      ) => void,
    ): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  export class Container extends EventEmitter {
    element: HTMLElement;
    canvas: HTMLCanvasElement;
    supportsPointerLock: boolean;
    pointerInGame: boolean;
    isFocused: boolean;
    hasPointerLock: boolean;

    setPointerLock(lock: boolean): void;
  }

  export class Registry {
    registerBlock(id: number, options?: BlockOptions): number;
    registerMaterial(
      name: string,
      {
        atlasIndex,
        color,
        renderMaterial,
        texHasAlpha,
        textureURL,
      }: {
        atlasIndex: number;
        color: number[];
        textureURL: string | null;
        texHasAlpha: boolean;
        renderMaterial: Material | null;
      },
    ): void;
    getBlockSolidity(id: number): boolean;
    getBlockOpacity(id: number): boolean;
    getBlockFluidity(id: number): boolean;
    getBlockProps(id: number): Record<string, any>;
    getBlockFaceMaterial(id: number): any;
    getMaterialData(name: string): MatDef;
  }

  export interface BlockOptions {
    solid?: boolean;
    opaque?: boolean;
    fluid?: boolean;
    material?: string | string[];
    blockMesh?: Mesh | TransformNode;
    fluidDensity?: number;
    viscosity?: number;
    onLoad?: (x: number, y: number, z: number) => void;
    onUnload?: (x: number, y: number, z: number) => void;
    onSet?: (x: number, y: number, z: number) => void;
    onUnset?: (x: number, y: number, z: number) => void;
    onCustomMeshCreate?: (
      mesh: TransformNode | Mesh,
      x: number,
      y: number,
      z: number,
    ) => void;
  }

  export interface MatDef {
    color: number[];
    alpha: number;
    texture: string;
    texHasAlpha: boolean;
    atlasIndex: number;
    renderMat: Material;
  }

  export class World extends EventEmitter {
    manuallyControlChunkLoading: boolean;
    worldGenWhilePaused: boolean;
    maxChunksPendingCreation: number;
    maxChunksPendingMeshing: number;
    maxProcessingPerTick: number;
    maxProcessingPerRender: number;

    getBlockID(x: number, y: number, z: number): number;
    getBlockSolidity(x: number, y: number, z: number): boolean;
    getBlockOpacity(x: number, y: number, z: number): boolean;
    getBlockFluidity(x: number, y: number, z: number): boolean;
    getBlockProperties(x: number, y: number, z: number): Record<string, any>;
    setBlockID(id: number, x: number, y: number, z: number): void;
    isBoxUnobstructed(box: any): boolean;
    setChunkData(
      id: string,
      array: Int32Array | Uint32Array | Uint16Array,
      userData?: any,
    ): void;
    setAddRemoveDistance(addDist: number, removeDist: number): void;
    invalidateVoxelsInAABB(box: any): void;
    manuallyLoadChunk(x: number, y: number, z: number): void;
    manuallyUnloadChunk(x: number, y: number, z: number): void;

    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  export class Chunk {
    noa: Engine;
    isDisposed: boolean;
    userData: any;
    requestID: any;
    voxels: Int32Array | Uint32Array | Uint16Array;
    i: number;
    j: number;
    k: number;
    size: number;
    x: number;
    y: number;
    z: number;
    pos: Vec3;

    get(x: number, y: number, z: number): number;
    getSolidityAt(x: number, y: number, z: number): boolean;
    set(x: number, y: number, z: number, id: number): void;
    updateMeshes(): void;
    dispose(): void;
  }

  export class Rendering {
    renderOnResize: boolean;
    engine: Engine;
    scene: Scene;
    light: Light;
    camera: BabylonCamera;

    getScene(): Scene;
    addMeshToScene(mesh: TransformNode | Mesh, isStatic?: boolean): void;
    setMeshVisibility(mesh: TransformNode | Mesh, visible: boolean): void;
    makeStandardMaterial(name: string): Material;
  }

  export class Physics {
    gravity: Vec3;
    airDrag: number;
    fluidDensity: number;
    fluidDrag: number;
    minBounceImpulse: number;
    bodies: RigidBody[];

    addBody(box: any): RigidBody;
    removeBody(body: RigidBody): void;
    tick(dt: number): void;
  }

  export class RigidBody {
    aabb: any;
    mass: number;
    friction: number;
    restitution: number;
    gravityMultiplier: number;
    autoStep: boolean;
    airDrag: number;
    fluidDrag: number;
    velocity: Vec3;
    resting: Vec3;
    inFluid: boolean;

    setPosition(pos: Vec3): void;
    getPosition(): Vec3;
    applyForce(force: Vec3): void;
    applyImpulse(impulse: Vec3): void;
    atRestX(): number;
    atRestY(): number;
    atRestZ(): number;
  }

  export class Entities {
    names: Record<string, string>;

    hasPhysics(id: number): boolean;
    hasPosition(id: number): boolean;
    hasMesh(id: number): boolean;

    getPositionData(id: number): {
      position: Vec3;
      width: number;
      height: number;
      _localPosition: Vec3;
      _renderPosition: Vec3;
      _extents: Vec3;
    };
    getPosition(id: number): Vec3;
    getPhysics(id: number): { body: RigidBody };
    getPhysicsBody(id: number): RigidBody;
    getMeshData(id: number): { mesh: Mesh | TransformNode; offset: Vec3 };
    getMovement(id: number): MovementState;
    getCollideTerrain(id: number): { callback: (impulse: Vec3) => void };
    getCollideEntities(id: number): {
      cylinder: boolean;
      collideBits: number;
      collideMask: number;
      callback: (otherId: number) => void;
    };

    setPosition(id: number, pos: Vec3): void;
    setEntitySize(
      id: number,
      width: number,
      height: number,
      depth?: number,
    ): void;
    isTerrainBlocked(x: number, y: number, z: number): boolean;
    getEntitiesInAABB(box: any, withComponent?: string): number[];

    createEntity(
      position: Vec3,
      width: number,
      height: number,
      mesh: Mesh | TransformNode | null,
      offset: Vec3,
      doPhysics: boolean,
      shadow: boolean,
    ): number;

    deleteEntity(id: number): void;
    addComponent(id: number, name: string, state?: any): void;
    hasComponent(id: number, name: string): boolean;
    removeComponent(id: number, name: string): void;
  }

  export interface MovementState {
    heading: number;
    running: boolean;
    jumping: boolean;
    maxSpeed: number;
    moveForce: number;
    responsiveness: number;
    runningFriction: number;
    standingFriction: number;
    airMoveMult: number;
    jumpImpulse: number;
    jumpForce: number;
    jumpTime: number;
    airJumps: number;
  }

  export class Camera {
    noa: Engine;
    sensitivityX: number;
    sensitivityY: number;
    inverseX: boolean;
    inverseY: boolean;
    sensitivityMult: number;
    sensitivityMultOutsidePointerlock: number;
    heading: number;
    pitch: number;
    cameraTarget: number;
    zoomDistance: number;
    zoomSpeed: number;
    currentZoom: number;

    getTargetPosition(): Vec3;
    getPosition(): Vec3;
    getDirection(): Vec3;
  }

  export class GameInputs {
    version: string;
    element: HTMLElement;
    preventDefaults: boolean;
    stopPropagation: boolean;
    allowContextMenu: boolean;
    disabled: boolean;

    down: EventEmitter;
    up: EventEmitter;
    state: Record<string, boolean>;
    pointerState: {
      dx: number;
      dy: number;
      scrollx: number;
      scrolly: number;
      scrollz: number;
    };
    pressCount: Record<string, number>;
    releaseCount: Record<string, number>;

    bind(name: string, ...keys: string[]): void;
    unbind(name: string): void;
    getBindings(): Record<string, string[]>;
    tick(): void;
  }
}
