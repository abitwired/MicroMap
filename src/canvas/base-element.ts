import { CanvasElement } from "./types";

export class BaseElement implements CanvasElement {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    console.warn("draw method not implemented");
  }

  containsPoint(worldX: number, worldY: number) {
    const pointInsideElement =
      worldX >= this.x &&
      worldX <= this.x + this.width &&
      worldY >= this.y - 10 &&
      worldY <= this.y + this.height;

    return pointInsideElement;
  }
}

export default BaseElement;
