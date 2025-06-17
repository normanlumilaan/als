import { SpectrumRenderer } from "./spectrumRenderer";
import type { DrawInstruction } from "./interfaces/SpectrumRenderer";

export function createSpectrumDemo(canvasElement: HTMLCanvasElement): void {
  const renderer = new SpectrumRenderer();
  renderer.setCanvas(canvasElement);

  const drawInstructions: DrawInstruction[] = [
    { type: "pixel", x: 10, y: 10, color: 2 },
    { type: "pixel", x: 11, y: 10, color: 2 },
    { type: "pixel", x: 12, y: 10, color: 2 },

    { type: "rectangle", x: 20, y: 20, width: 30, height: 20, color: 4 },
    { type: "rectangle", x: 25, y: 25, width: 20, height: 10, color: 15 },

    { type: "text", x: 60, y: 30, text: "ZX SPECTRUM", color: 14 },
    { type: "text", x: 60, y: 40, text: "RENDERER", color: 10 },

    { type: "rectangle", x: 100, y: 60, width: 50, height: 50, color: 1 },
    { type: "rectangle", x: 110, y: 70, width: 30, height: 30, color: 3 },
    { type: "rectangle", x: 120, y: 80, width: 10, height: 10, color: 15 },
  ];

  drawInstructions.forEach((instruction) => renderer.draw(instruction));
  renderer.render();

  window.addEventListener("resize", () => {
    renderer.resize();
    renderer.clear();
    drawInstructions.forEach((instruction) => renderer.draw(instruction));
    renderer.render();
  });
}
