export interface EngineOptions {
  // --- Camera ---
  inverseX?: boolean;
  inverseY?: boolean;
  sensitivityX?: number;
  sensitivityY?: number;
  initialZoom?: number;
  zoomSpeed?: number;
  sensitivityMult?: number;
  sensitivityMultOutsidePointerlock?: number;

  // --- World ---
  manuallyControlChunkLoading?: boolean;
  minNeighborsToMesh?: number;
  worldGenWhilePaused?: boolean;
  maxChunksPendingCreation?: number;
  maxChunksPendingMeshing?: number;
  maxProcessingPerTick?: number;
  maxProcessingPerRender?: number;

  // --- Physics ---
  gravity?: number[] | number;
  airDrag?: number;
  fluidDensity?: number;
  fluidDrag?: number;
  minBounceImpulse?: number;

  // --- Engine & General ---
  worldName?: string;
  timeScale?: number;
  tickRate?: number;
  maxRenderRate?: number;
  blockTestDistance?: number;

  // --- Inputs ---
  preventDefaults?: boolean;
  stopPropagation?: boolean;
  allowContextMenu?: boolean;
  disabled?: boolean;
}