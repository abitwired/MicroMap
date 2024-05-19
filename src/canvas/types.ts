import { IMenuAction } from "./context-menu/menu-action";

/**
 * Represents a canvas element.
 */
export interface CanvasElement {
  /**
   * Gets the ID of the canvas element.
   * @returns The ID of the canvas element.
   */
  getId(): string;

  /**
   * Draws the canvas element on the provided 2D rendering context.
   * @param ctx - The 2D rendering context of the canvas.
   */
  draw(ctx: CanvasRenderingContext2D): void;

  /**
   * Checks if the canvas element contains the specified point.
   * @param x - The x-coordinate of the point.
   * @param y - The y-coordinate of the point.
   * @returns True if the canvas element contains the point, false otherwise.
   */
  containsPoint(x: number, y: number): boolean;

  /**
   * Gets the context menu actions for the canvas element.
   * @returns An array of context menu actions.
   */
  getContextMenuActions(): IMenuAction[];
}

/**
 * Represents a draggable element on the canvas.
 */
export interface DraggableElement {
  /**
   * Called when the drag operation starts.
   * @param x - The x-coordinate of the starting position.
   * @param y - The y-coordinate of the starting position.
   */
  onDragStart(x: number, y: number): void;

  /**
   * Called when the element is being dragged.
   * @param x - The current x-coordinate of the element.
   * @param y - The current y-coordinate of the element.
   */
  onDragMove(x: number, y: number): void;

  /**
   * Called when the drag operation ends.
   */
  onDragEnd(): void;
}

/**
 * Represents a text element.
 */
export interface TextElement {}

/**
 * Represents an element that can be hovered over.
 */
export interface HoverableElement {
  /**
   * Called when the element is being hovered over.
   */
  onHover(): void;

  /**
   * Called when the hover state of the element is ended.
   */
  hoverOff(): void;
}
