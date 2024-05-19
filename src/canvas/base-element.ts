import { IMenuAction } from "./context-menu/menu-action";
import { CanvasElement } from "./types";

export class BaseElement implements CanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(id: string, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getId(): string {
    return this.id;
  }

  getContextMenuActions(): IMenuAction[] {
    console.warn("getContextMenu method not implemented");
    return [];
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
