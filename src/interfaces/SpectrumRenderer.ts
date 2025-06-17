export interface DrawInstruction {
  type: "pixel" | "rectangle" | "text" | "sprite";
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: number;
  backgroundColor?: number;
  data?: Uint8Array;
  text?: string;
}

export interface SpectrumRendererInterface {
  setCanvas(canvas: HTMLCanvasElement): void;
  clear(): void;
  draw(instruction: DrawInstruction): void;
  render(): void;
  resize(): void;
}
