import { CanvasElement, EditableCanvasElement } from "./types";

export class InfiniteCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  elements: CanvasElement[];
  scale: number;
  offsetX: number;
  offsetY: number;
  isPanning: boolean;
  startX: number;
  startY: number;
  draggingElement: CanvasElement | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.elements = [];
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.draggingElement = null;

    this.initialize();
  }

  initialize() {
    window.addEventListener("resize", () => this.resizeCanvas());
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("wheel", (e) => this.zoom(e), {
      passive: false,
    });

    this.resizeCanvas();
    this.draw();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  onMouseDown(event: MouseEvent) {
    const { clientX, clientY } = event;
    const worldX = (clientX - this.offsetX) / this.scale;
    const worldY = (clientY - this.offsetY) / this.scale;

    // Set cursor to grabbing
    this.canvas.style.cursor = "grabbing";

    for (const element of this.elements) {
      if (element.containsPoint(worldX, worldY)) {
        if ("containsTextPoint" in element) {
          const editableElement = element as EditableCanvasElement;
          if (editableElement.containsTextPoint(worldX, worldY)) {
          console.log(editableElement);
            editableElement.startEditingText(
              this.ctx,
              this.offsetX,
              this.offsetY,
              this.scale
            );
            return;
          }
        }

        this.draggingElement = element;
        element.onDragStart(worldX, worldY);
        return;
      }
    }

    this.isPanning = true;
    this.startX = clientX - this.offsetX;
    this.startY = clientY - this.offsetY;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isPanning) {
      this.offsetX = event.clientX - this.startX;
      this.offsetY = event.clientY - this.startY;
      this.draw();
    } else if (this.draggingElement) {
      const { clientX, clientY } = event;
      const worldX = (clientX - this.offsetX) / this.scale;
      const worldY = (clientY - this.offsetY) / this.scale;
      this.draggingElement.onDragMove(worldX, worldY);
      this.draw();
    }
  }

  onMouseUp() {
    this.canvas.style.cursor = "default";
    if (this.isPanning) {
      this.isPanning = false;
    }
    if (this.draggingElement) {
      this.draggingElement.onDragEnd();
      this.draggingElement = null;
    }
  }

  zoom(event: WheelEvent) {
    event.preventDefault();
    const scaleFactor = 1.1;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const zoomIn = event.deltaY < 0;

    const worldX = (mouseX - this.offsetX) / this.scale;
    const worldY = (mouseY - this.offsetY) / this.scale;

    this.scale *= zoomIn ? scaleFactor : 1 / scaleFactor;

    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;

    this.draw();
  }

  addElement(element: CanvasElement) {
    this.elements.push(element);
    this.draw();
  }

  drawGrid() {
    const gridSize = 50;

    // add dots
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (
      let x = -this.offsetX % gridSize;
      x < this.canvas.width;
      x += gridSize
    ) {
      for (
        let y = -this.offsetY % gridSize;
        y < this.canvas.height;
        y += gridSize
      ) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  drawElements() {
    this.elements.forEach((element) => {
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
      element.draw(this.ctx);
      this.ctx.restore();
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set the background color to #333
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawElements();
  }
}

export default InfiniteCanvas;
