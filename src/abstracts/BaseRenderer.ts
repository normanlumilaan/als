export abstract class BaseRenderer {
  protected canvas: HTMLCanvasElement | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected pixelRatio: number = 1;
  protected scale: number = 1;

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", {
      alpha: false,
      imageSmoothingEnabled: false,
    }) as CanvasRenderingContext2D;
    this.updatePixelRatio();
    this.resize();
  }

  protected updatePixelRatio(): void {
    this.pixelRatio = window.devicePixelRatio || 1;
  }

  protected updateScale(): void {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.scale = Math.min(
      rect.width / this.getLogicalWidth(),
      rect.height / this.getLogicalHeight()
    );
  }

  resize(): void {
    if (!this.canvas || !this.ctx) return;

    this.updatePixelRatio();
    this.updateScale();

    const rect = this.canvas.getBoundingClientRect();
    const displayWidth = rect.width * this.pixelRatio;
    const displayHeight = rect.height * this.pixelRatio;

    this.canvas.width = displayWidth;
    this.canvas.height = displayHeight;

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  abstract getLogicalWidth(): number;
  abstract getLogicalHeight(): number;
}
