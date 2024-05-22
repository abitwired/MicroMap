import { IMenuAction } from "./context-menu/menu-action";
import InfiniteCanvas from "./infinite-canvas";
import { CanvasElement, Serializer } from "./types";

/**
 * Represents a base element in the canvas.
 */
export class BaseElement implements CanvasElement, Serializer {
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

  getActions(canvas: InfiniteCanvas): IMenuAction[] {
    console.warn("getActions method not implemented");
    return [];
  }

  /**
   * Gets the unique identifier of the element.
   * @returns The unique identifier of the element.
   */
  getId(): string {
    return this.id;
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

  /**
   * Serializes the element to a JSON object.
   * @returns The JSON representation of the element.
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Creates a new instance of the element from a JSON object.
   * @param json - The JSON object to create the element from.
   * @returns A new instance of the element.
   */
  fromJSON(json: Record<string, unknown>): BaseElement {
    if (!json.id || !json.x || !json.y || !json.width || !json.height) {
      throw new Error("Invalid JSON object");
    }

    return new BaseElement(
      json.id as string,
      json.x as number,
      json.y as number,
      json.width as number,
      json.height as number
    );
  }
}

export default BaseElement;
