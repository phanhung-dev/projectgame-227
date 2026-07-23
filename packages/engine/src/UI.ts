import type { Engine as NoaEngine } from "noa-engine";

export class UI {
  private noa: NoaEngine;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private every = 600;
  private ct = 0;
  private start = performance.now();

  private fps = 0;

  constructor(engine: NoaEngine) {
    this.noa = engine;
  }

  public init() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "project_minihud";

    this.canvas.style.position = "fixed";
    this.canvas.style.top = "12px";
    this.canvas.style.left = "12px";
    this.canvas.style.zIndex = "9999";
    this.canvas.style.pointerEvents = "none";

    this.canvas.width = 160;
    this.canvas.height = 200;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
  }

  public initListeners() {
    this.noa.on("beforeRender", () => {
      this.updateFPS();
      this.drawHUD();
    });
  }

  public updateFPS() {
    this.ct++;
    var nt = performance.now();
    if (nt - this.start < this.every) return;
    this.fps = Math.round((this.ct / (nt - this.start)) * 1000);
    this.ct = 0;
    this.start = nt;
  }

  public drawHUD() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(15, 15, 20, 0.75)";
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, this.canvas.width, this.canvas.height, 8);
    this.ctx.fill();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.stroke();

    // FPS
    this.ctx.font = "bold 12px Menlo, Monaco, Consolas, monospace";
    this.ctx.fillStyle = this.fps < 30 ? "#ff4d4d" : "#00ffcc";
    this.ctx.fillText(`FPS: ${this.fps}`, 12, 22);

    const position = this.noa.entities.getPosition(this.noa.playerEntity);
    const chunkSize = 16;

    const currentChunkX = Math.floor(position[0] / chunkSize);
    const currentChunkZ = Math.floor(position[2] / chunkSize);

    const offsetX = (position[0] % chunkSize) / chunkSize;
    const offsetZ = (position[2] % chunkSize) / chunkSize;


    // Position X, Y, Z and Chunk
    this.ctx.font = "10px monospace";
    this.ctx.fillStyle = "#ffffff";
    const x = Math.floor(position[0]);
    const y = Math.floor(position[1]);
    const z = Math.floor(position[2]);
    this.ctx.fillText(`[${x}, ${y}, ${z}] [${currentChunkX}, ${currentChunkZ}]`, 12, 42);

    const cellSize = 32;
    const startX = 16;
    const startY = 52;
    const gridCols = 4;
    const gridRows = 4;

    this.ctx.strokeStyle = "rgb(255, 255, 255)"
    this.ctx.strokeRect(startX, startY, 32*4, 32 * 4)

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(startX, startY, gridCols * cellSize, gridRows * cellSize);
    this.ctx.clip();

    const renderOffsetX = offsetX * cellSize;
    const renderOffsetZ = offsetZ * cellSize;

    for (let row = -1; row <= gridRows; row++) {
      for (let col = -1; col <= gridCols; col++) {
        const cellX = startX + col * cellSize - renderOffsetX;
        const cellY = startY + row * cellSize + renderOffsetZ;

        const isCurrentChunk = row === 1 && col === 1;

        this.ctx.strokeStyle = isCurrentChunk
          ? "rgb(0, 255, 0)"
          : "rgba(255, 255, 255, 0.1)";
        this.ctx.lineWidth = isCurrentChunk ? 2 : 1;
        this.ctx.strokeRect(
          cellX + (currentChunkX >= 0 ? 32 : 0),
          cellY + (currentChunkZ >= 0 ? 0 : 32),
          cellSize - 2,
          cellSize - 2,
        );
      }
    }
    this.ctx.restore();



    // Arrow as player
    const centerX = startX + (gridCols * cellSize) / 2;
    const centerY = startY + (gridRows * cellSize) / 2;
    const playerHeading = this.noa.camera.heading;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(playerHeading);

    this.ctx.beginPath();
    this.ctx.moveTo(0, -8);
    this.ctx.lineTo(-6, 6);
    this.ctx.lineTo(0, 3);
    this.ctx.lineTo(6, 6);
    this.ctx.closePath();

    this.ctx.fillStyle = "#00ffcc";
    this.ctx.fill();
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.stroke();

    this.ctx.restore();
  }
}
