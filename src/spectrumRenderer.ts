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
  private textInstructions: DrawInstruction[] = [];

  constructor() {
    super();
    this.initializePalette();
  }

  private getColorByIndex(index: number): string {
    switch (index) {
      case 0:
        return SPECTRUM_COLORS.BLACK;
      case 1:
        return SPECTRUM_COLORS.BLUE;
      case 2:
        return SPECTRUM_COLORS.RED;
      case 3:
        return SPECTRUM_COLORS.MAGENTA;
      case 4:
        return SPECTRUM_COLORS.GREEN;
      case 5:
        return SPECTRUM_COLORS.CYAN;
      case 6:
        return SPECTRUM_COLORS.YELLOW;
      case 7:
        return SPECTRUM_COLORS.WHITE;
      case 8:
        return SPECTRUM_COLORS.BRIGHT_BLACK;
      case 9:
        return SPECTRUM_COLORS.BRIGHT_BLUE;
      case 10:
        return SPECTRUM_COLORS.BRIGHT_RED;
      case 11:
        return SPECTRUM_COLORS.BRIGHT_MAGENTA;
      case 12:
        return SPECTRUM_COLORS.BRIGHT_GREEN;
      case 13:
        return SPECTRUM_COLORS.BRIGHT_CYAN;
      case 14:
        return SPECTRUM_COLORS.BRIGHT_YELLOW;
      case 15:
        return SPECTRUM_COLORS.BRIGHT_WHITE;
      default:
        return SPECTRUM_COLORS.BRIGHT_WHITE;
    }
  }

  private initializePalette(): void {
    const colors = [
      SPECTRUM_COLORS.BLACK,
      SPECTRUM_COLORS.BLUE,
      SPECTRUM_COLORS.RED,
      SPECTRUM_COLORS.MAGENTA,
      SPECTRUM_COLORS.GREEN,
      SPECTRUM_COLORS.CYAN,
      SPECTRUM_COLORS.YELLOW,
      SPECTRUM_COLORS.WHITE,
      SPECTRUM_COLORS.BRIGHT_BLACK,
      SPECTRUM_COLORS.BRIGHT_BLUE,
      SPECTRUM_COLORS.BRIGHT_RED,
      SPECTRUM_COLORS.BRIGHT_MAGENTA,
      SPECTRUM_COLORS.BRIGHT_GREEN,
      SPECTRUM_COLORS.BRIGHT_CYAN,
      SPECTRUM_COLORS.BRIGHT_YELLOW,
      SPECTRUM_COLORS.BRIGHT_WHITE,
    ];

    this.colorPalette = colors.map((color) => {
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

    // Clear text instructions when clearing the screen
    this.textInstructions = [];
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
    // Store text instructions to be rendered after the buffer is drawn
    if (!instruction.text) return;

    if (!this.textInstructions) {
      this.textInstructions = [];
    }
    this.textInstructions.push(instruction);
  }

  private renderTextInstructions(scaleX: number, scaleY: number): void {
    if (!this.ctx || !this.textInstructions.length) return;

    this.ctx.save();
    this.ctx.font = `${14 * scaleY}px monospace`;
    this.ctx.textBaseline = "top";

    for (const instruction of this.textInstructions) {
      if (!instruction.text) continue;

      const x = (SPECTRUM_BORDER_WIDTH + instruction.x) * scaleX;
      const y = (SPECTRUM_BORDER_HEIGHT + instruction.y) * scaleY;

      this.ctx.fillStyle = this.getColorByIndex(instruction.color || 15);
      this.ctx.fillText(instruction.text, x, y);
    }

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

    // Draw text instructions after the buffer is rendered
    this.renderTextInstructions(scaleX, scaleY);
  }
}
