import type { Engine as NoaEngine } from "noa-engine";

const createCvs = (id: string, w: number, h: number, style: Partial<CSSStyleDeclaration>) => {
  const c = document.createElement("canvas");
  Object.assign(c.style, { position: "fixed", zIndex: "9999", pointerEvents: "none", ...style });
  c.id = id;
  c.width = w;
  c.height = h;
  document.body.appendChild(c);
  return { c, ctx: c.getContext("2d")! };
};

export class UI {
  private canvas_minihud!: HTMLCanvasElement;
  private ctx_minihud!: CanvasRenderingContext2D;
  private canvas_inventory!: HTMLCanvasElement;
  private ctx_inventory!: CanvasRenderingContext2D;

  private slot_inventory = 0;
  private ct = 0;
  private start = performance.now();
  private fps = 0;

  private bg = new Image();
  private bgAmb = new Image();

  constructor(private noa: NoaEngine) {
    this.bg.src = "./src/assets/effect_background.png";
    this.bgAmb.src = "./src/assets/effect_background_ambient.png";
  }

  public init() {
    ({ c: this.canvas_minihud, ctx: this.ctx_minihud } = createCvs("project_minihud", 160, 200, {
      top: "12px", left: "12px"
    }));
    ({ c: this.canvas_inventory, ctx: this.ctx_inventory } = createCvs("project_inventory", 730, 80, {
      bottom: "0px", left: "50%", transform: "translateX(-50%)"
    }));
  }

  public initListeners() {
    this.noa.on("beforeRender", () => {
      this.ct++;
      const nt = performance.now();
      if (nt - this.start >= 600) {
        this.fps = Math.round((this.ct / (nt - this.start)) * 1000);
        this.ct = 0;
        this.start = nt;
      }
      this.drawHUD();
    });

    this.bg.onload = this.bgAmb.onload = () => this.draw_inventory();

    this.noa.on("tick", () => {
      const scroll = this.noa.inputs.pointerState.scrolly;
      if (!scroll) return;
      this.slot_inventory = (this.slot_inventory + (scroll > 0 ? 1 : -1) + 10) % 10;
      this.draw_inventory();
    });
  }

  public drawHUD() {
    const ctx = this.ctx_minihud;
    ctx.clearRect(0, 0, 160, 200);

    ctx.fillStyle = "rgba(15, 15, 20, 0.75)";
    ctx.beginPath();
    ctx.roundRect(0, 0, 160, 200, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    ctx.font = "bold 12px Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = this.fps < 30 ? "#ff4d4d" : "#00ffcc";
    ctx.fillText(`FPS: ${this.fps}`, 12, 22);

    const [px, py, pz] = this.noa.entities.getPosition(this.noa.playerEntity);
    const cx = Math.floor(px / 16), cz = Math.floor(pz / 16);
    const ox = (px % 16) / 16, oz = (pz % 16) / 16;

    ctx.font = "10px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`[${Math.floor(px)}, ${Math.floor(py)}, ${Math.floor(pz)}] [${cx}, ${cz}]`, 12, 42);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(16, 52, 128, 128);

    ctx.save();
    ctx.beginPath();
    ctx.rect(16, 52, 128, 128);
    ctx.clip();

    for (let r = -1; r <= 4; r++) {
      for (let c = -1; c <= 4; c++) {
        const isCurr = r === 1 && c === 1;
        ctx.strokeStyle = isCurr ? "#0f0" : "rgba(255,255,255,0.1)";
        ctx.lineWidth = isCurr ? 2 : 1;
        ctx.strokeRect(
          16 + c * 32 - ox * 32 + (cx >= 0 ? 32 : 0),
          52 + r * 32 + oz * 32 + (cz >= 0 ? 0 : 32),
          30, 30
        );
      }
    }
    ctx.restore();

    ctx.save();
    ctx.translate(80, 116);
    ctx.rotate(this.noa.camera.heading);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-6, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(6, 6);
    ctx.closePath();
    
    ctx.fillStyle = "#00ffcc";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.restore();
  }

  public draw_inventory() {
    this.ctx_inventory.clearRect(0, 0, 730, 80);
    for (let i = 0; i < 10; i++) {
      const img = i === this.slot_inventory ? this.bgAmb : this.bg;
      if (img.complete && img.naturalWidth) {
        this.ctx_inventory.drawImage(img, i * 74, 0);
      }
    }
  }
}