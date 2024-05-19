import Node from "./node";
import { TextElement } from "./types";

export class Text extends Node implements TextElement {
  text: string;
  fontColor: string;

  constructor({
    x,
    y,
    width,
    height,
    text,
    color,
    fontColor,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    color: string;
    fontColor: string;
  }) {
    super({ x, y, width, height, color });
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
