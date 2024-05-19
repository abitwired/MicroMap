import { IMenuAction } from "./context-menu/menu-action";
import { CanvasElement } from "./types";

/**
 * Represents a base element in the canvas.
 */
export class BaseElement implements CanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;

  /**
   * Creates a new instance of the BaseElement class.
   * @param id - The unique identifier of the element.
   * @param x - The x-coordinate of the element.
   * @param y - The y-coordinate of the element.
   * @param width - The width of the element.
   * @param height - The height of the element.
   */
  constructor(id: string, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Gets the unique identifier of the element.
   * @returns The unique identifier of the element.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets the context menu actions for the element.
   * @returns An array of context menu actions.
   */
  getContextMenuActions(): IMenuAction[] {
    console.warn("getContextMenu method not implemented");
    return [];
  }

  /**
   * Draws the element on the canvas.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    console.warn("draw method not implemented");
  }

  /**
   * Checks if the specified point is inside the element.
   * @param worldX - The x-coordinate of the point in the world.
   * @param worldY - The y-coordinate of the point in the world.
   * @returns True if the point is inside the element, false otherwise.
   */
  containsPoint(worldX: number, worldY: number) {
    const pointInsideElement =
      worldX >= this.x &&
      worldX <= this.x + this.width &&
      worldY >= this.y &&
      worldY <= this.y + this.height;
    return pointInsideElement;
  }
}

export default BaseElement;
