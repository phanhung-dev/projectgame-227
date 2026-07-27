import { Engine as NoaEngine } from "noa-engine";

export class Input {
  private isSprinting = false;
  private isCurrentZoom: number;
  private isPov: number;

  constructor(private noa: NoaEngine) {
    this.isPov = 0;
    this.isCurrentZoom = this.noa.camera.currentZoom;
  }

  public init() {
    const { inputs } = this.noa;
    inputs.bind("inventory", "KeyE");
    inputs.bind("change_pov", "KeyV");
    inputs.bind("sprint", "ShiftLeft");

    this.noa.on("tick", () => {
      if (!this.isSprinting) return;
      this.noa.camera.currentZoom = this.isCurrentZoom + 0.5;
      this.noa.camera.zoomSpeed = 0;
    });
    this.change_pov();
  }



  
  public open_inventory() {
    //TODO: coming soon
    this.noa.inputs.down.on("inventory", () => {
      (window as any).camera = this.noa.camera;
      var followState = this.noa.ents.getState(
        this.noa.camera.cameraTarget,
        "followsEntity",
      );

      followState.offset[1] = 1.2 * 1.8;
      console.log("open inventory", this.noa.camera);
    });
  }

  public sprint() {
    const { inputs, entities, playerEntity, camera } = this.noa;

    inputs.down.on("sprint", () => {
      entities.getMovement(playerEntity).maxSpeed = 9;
      this.isSprinting = true;
    });

    inputs.up.on("sprint", () => {
      entities.getMovement(playerEntity).maxSpeed = 5;
      this.isSprinting = false;
      camera.currentZoom = this.isCurrentZoom;
    });
  }

  public change_pov() {
    const { inputs, camera } = this.noa;
    this.isCurrentZoom = camera.currentZoom;
    inputs.down.on("change_pov", () => {
      if (this.isPov === 0) {
        camera.zoomDistance = 4;
        this.isPov = 4;
      } else if (this.isPov === 4) {
        camera.zoomDistance = 0;
        this.isPov = 0;
      }
    });
  }
}
