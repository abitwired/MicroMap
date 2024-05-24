import MenuAction, { IMenuAction } from "../context-menu/menu-action";
import { InfiniteCanvas } from "../infinite-canvas";
import { TextElement } from "../types";
import { Vertex } from "./vertex";

/**
 * Represents a text element in the canvas.
 */
export class Node extends Vertex implements TextElement {
  id: string;
  label: string;
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
    label,
    color,
    fontColor,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    color: string;
    fontColor: string;
  }) {
    super({ id, x, y, width, height, color });
    this.label = label;
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
    const lines = this.getLines(ctx, this.label, this.width / 2);
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

  public getActions(canvas: InfiniteCanvas): IMenuAction[] {
    const deleteAction: IMenuAction = MenuAction({
      name: "Delete",
      onClick: () => {
        canvas.hideContextMenu();
        canvas.deleteElement(this.id);
      },
    });
    return [deleteAction];
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
  static fromJSON(json: Record<string, unknown>): Node {
    if (
      json.id === undefined ||
      json.x === undefined ||
      json.y === undefined ||
      json.width === undefined ||
      json.height === undefined ||
      json.text === undefined ||
      json.color === undefined ||
      json.fontColor === undefined
    ) {
      throw new Error("Incomplete JSON object");
    }

    return new Node({
      id: json.id as string,
      x: json.x as number,
      y: json.y as number,
      width: json.width as number,
      height: json.height as number,
      label: json.text as string,
      color: json.color as string,
      fontColor: json.fontColor as string,
    });
  }
}
