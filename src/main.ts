import { createSpectrumDemo } from "./spectrumDemo";
import "./style.css";

const canvas = document.createElement("canvas");
canvas.width = 320;
canvas.height = 240;
canvas.style.width = "640px";
canvas.style.height = "480px";
canvas.style.imageRendering = "pixelated";
canvas.style.border = "2px solid #333";

document.body.appendChild(canvas);

createSpectrumDemo(canvas);
