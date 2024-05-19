import { IMenuAction } from "./context-menu/menu-action";
import Node from "./node/node";
import { TextElement } from "./types";

export class Text extends Node implements TextElement {
  id: string;
  text: string;
  fontColor: string;

  constructor({
    id,
    x,
    y,
    width,
    height,
    text,
    color,
    fontColor,
    contextMenuActions,
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
  }) {
    super({ id, x, y, width, height, color, contextMenuActions });
    this.text = text;
    this.fontColor = fontColor;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    ctx.transform(1, 0, 0, 1, this.x, this.y);
    ctx.fillStyle = this.fontColor;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Hello, world.", this.width / 2, this.height / 2);
  }

  onDoubleClick(e: MouseEvent): void {
    console.log("Double clicked!");
  }
}
