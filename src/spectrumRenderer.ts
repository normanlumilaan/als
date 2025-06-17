import { BaseRenderer } from "./abstracts/BaseRenderer";
import {
  type DrawInstruction,
  type SpectrumRendererInterface,
} from "./interfaces/SpectrumRenderer";
import {
  SPECTRUM_COLORS,
  SPECTRUM_TOTAL_WIDTH,
  SPECTRUM_TOTAL_HEIGHT,
  SPECTRUM_WIDTH,
  SPECTRUM_HEIGHT,
  SPECTRUM_BORDER_WIDTH,
  SPECTRUM_BORDER_HEIGHT,
} from "./types/SpectrumTypes";

export class SpectrumRenderer
  extends BaseRenderer
  implements SpectrumRendererInterface
{
  private imageData: ImageData | null = null;
  private buffer: Uint32Array | null = null;
  private colorPalette: number[] = [];

  constructor() {
    super();
    this.initializePalette();
  }

  private initializePalette(): void {
    this.colorPalette = SPECTRUM_COLORS.map((color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return (255 << 24) | (b << 16) | (g << 8) | r;
    });
  }

  getLogicalWidth(): number {
    return SPECTRUM_TOTAL_WIDTH;
  }

  getLogicalHeight(): number {
    return SPECTRUM_TOTAL_HEIGHT;
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    super.setCanvas(canvas);
    this.initializeBuffer();
  }

  private initializeBuffer(): void {
    if (!this.ctx) return;

    this.imageData = this.ctx.createImageData(
      SPECTRUM_TOTAL_WIDTH,
      SPECTRUM_TOTAL_HEIGHT
    );
    this.buffer = new Uint32Array(this.imageData.data.buffer);
    this.clear();
  }

  clear(): void {
    if (!this.buffer) return;

    const borderColor = this.colorPalette[0];
    this.buffer.fill(borderColor);

    const screenStartX = SPECTRUM_BORDER_WIDTH;
    const screenStartY = SPECTRUM_BORDER_HEIGHT;
    const screenColor = this.colorPalette[7];

    for (let y = 0; y < SPECTRUM_HEIGHT; y++) {
      const rowStart = (screenStartY + y) * SPECTRUM_TOTAL_WIDTH + screenStartX;
      for (let x = 0; x < SPECTRUM_WIDTH; x++) {
        this.buffer[rowStart + x] = screenColor;
      }
    }
  }

  draw(instruction: DrawInstruction): void {
    if (!this.buffer) return;

    switch (instruction.type) {
      case "pixel":
        this.drawPixel(instruction);
        break;
      case "rectangle":
        this.drawRectangle(instruction);
        break;
      case "sprite":
        this.drawSprite(instruction);
        break;
      case "text":
        this.drawText(instruction);
        break;
    }
  }

  private drawPixel(instruction: DrawInstruction): void {
    if (!this.buffer) return;

    const x = SPECTRUM_BORDER_WIDTH + instruction.x;
    const y = SPECTRUM_BORDER_HEIGHT + instruction.y;

    if (
      x >= 0 &&
      x < SPECTRUM_TOTAL_WIDTH &&
      y >= 0 &&
      y < SPECTRUM_TOTAL_HEIGHT
    ) {
      const color = this.colorPalette[instruction.color || 15];
      this.buffer[y * SPECTRUM_TOTAL_WIDTH + x] = color;
    }
  }

  private drawRectangle(instruction: DrawInstruction): void {
    if (!this.buffer || !instruction.width || !instruction.height) return;

    const color = this.colorPalette[instruction.color || 15];
    const startX = SPECTRUM_BORDER_WIDTH + instruction.x;
    const startY = SPECTRUM_BORDER_HEIGHT + instruction.y;

    for (let y = 0; y < instruction.height; y++) {
      const currentY = startY + y;
      if (
        currentY >= SPECTRUM_BORDER_HEIGHT &&
        currentY < SPECTRUM_TOTAL_HEIGHT - SPECTRUM_BORDER_HEIGHT
      ) {
        const rowStart = currentY * SPECTRUM_TOTAL_WIDTH;
        for (let x = 0; x < instruction.width; x++) {
          const currentX = startX + x;
          if (
            currentX >= SPECTRUM_BORDER_WIDTH &&
            currentX < SPECTRUM_TOTAL_WIDTH - SPECTRUM_BORDER_WIDTH
          ) {
            this.buffer[rowStart + currentX] = color;
          }
        }
      }
    }
  }

  private drawSprite(instruction: DrawInstruction): void {
    if (
      !this.buffer ||
      !instruction.data ||
      !instruction.width ||
      !instruction.height
    )
      return;

    const startX = SPECTRUM_BORDER_WIDTH + instruction.x;
    const startY = SPECTRUM_BORDER_HEIGHT + instruction.y;

    for (let y = 0; y < instruction.height; y++) {
      const currentY = startY + y;
      if (
        currentY >= SPECTRUM_BORDER_HEIGHT &&
        currentY < SPECTRUM_TOTAL_HEIGHT - SPECTRUM_BORDER_HEIGHT
      ) {
        const rowStart = currentY * SPECTRUM_TOTAL_WIDTH;
        for (let x = 0; x < instruction.width; x++) {
          const currentX = startX + x;
          if (
            currentX >= SPECTRUM_BORDER_WIDTH &&
            currentX < SPECTRUM_TOTAL_WIDTH - SPECTRUM_BORDER_WIDTH
          ) {
            const pixelIndex = y * instruction.width + x;
            const colorIndex = instruction.data[pixelIndex];
            if (colorIndex > 0) {
              this.buffer[rowStart + currentX] = this.colorPalette[colorIndex];
            }
          }
        }
      }
    }
  }

  private drawText(instruction: DrawInstruction): void {
    if (!this.ctx || !instruction.text) return;

    const x = SPECTRUM_BORDER_WIDTH + instruction.x;
    const y = SPECTRUM_BORDER_HEIGHT + instruction.y;

    this.ctx.save();
    this.ctx.font = "8px monospace";
    this.ctx.fillStyle = SPECTRUM_COLORS[instruction.color || 15];
    this.ctx.textBaseline = "top";
    this.ctx.fillText(instruction.text, x * this.scale, y * this.scale);
    this.ctx.restore();
  }

  render(): void {
    if (!this.ctx || !this.imageData || !this.canvas) return;

    this.ctx.putImageData(this.imageData, 0, 0);

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = rect.width / SPECTRUM_TOTAL_WIDTH;
    const scaleY = rect.height / SPECTRUM_TOTAL_HEIGHT;

    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(scaleX, scaleY);
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.restore();
  }
}
