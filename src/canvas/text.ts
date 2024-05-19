import MenuAction, { IMenuAction } from "./context-menu/menu-action";
import InfiniteCanvas from "./infinite-canvas";
import Node from "./node/node";
import { TextElement } from "./types";

/**
 * Represents a text element in the canvas.
 */
export class Text extends Node implements TextElement {
  id: string;
  text: string;
  fontColor: string;

  /**
   * Creates a new instance of the Text class.
   * @param id - The unique identifier for the text element.
   * @param x - The x-coordinate of the text element.
   * @param y - The y-coordinate of the text element.
   * @param width - The width of the text element.
   * @param height - The height of the text element.
   * @param text - The text content of the element.
   * @param color - The color of the text element.
   * @param fontColor - The font color of the text element.
   * @param contextMenuActions - Optional array of context menu actions for the text element.
   */
  constructor({
    id,
    x,
    y,
    width,
    height,
    text,
    color,
    fontColor,
    contextMenuActions = [],
    canvas,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    color: string;
    fontColor: string;
    contextMenuActions?: IMenuAction[];
    canvas: InfiniteCanvas;
  }) {
    const deleteAction: IMenuAction = MenuAction({
      name: "Delete",
      onClick: () => {
        canvas.hideContextMenu();
        canvas.deleteElement(id);
      },
    });
    contextMenuActions.push(deleteAction);

    super({ id, x, y, width, height, color, contextMenuActions });
    this.text = text;
    this.fontColor = fontColor;
  }

  getLines(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const lines = [];
    let line = "";
    const words = text.split(" ");
    words.forEach((word) => {
      const testLine = line + word + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth) {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    });

    lines.push(line);
    return lines;
  }

  /**
   * Draws the text element on the canvas.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    const lines = this.getLines(ctx, this.text, this.width / 2);
    super.setHeight(36 + lines.length * 16);
    super.draw(ctx);

    ctx.transform(1, 0, 0, 1, this.x, this.y);
    const totalOffsetY = lines.length > 1 ? lines.length * 7.25 : 18;
    lines.forEach((line, index) => {
      ctx.fillStyle = this.fontColor;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        line,
        this.width / 2,
        this.height / 2 + (lines.length > 1 ? index * 18 : 18) - totalOffsetY
      );
    });
  }

  /**
   * Handles the double click event on the text element.
   * @param e - The mouse event object.
   */
  onDoubleClick(e: MouseEvent): void {
    console.log("Double clicked!");
  }
}
