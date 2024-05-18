import { CanvasElement } from "./types";

class Rectangle implements CanvasElement {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  dragOffsetX: number;
  dragOffsetY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }
  containsPoint(x: number, y: number) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  onDragStart(x: number, y: number) {
    this.dragOffsetX = x - this.x;
    this.dragOffsetY = y - this.y;
  }

  onDragMove(x: number, y: number) {
    this.x = x - this.dragOffsetX;
    this.y = y - this.dragOffsetY;
  }

  onDragEnd() {
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export { Rectangle };
