import BaseElement from "../base-element";
import MenuAction, { IMenuAction } from "../context-menu/menu-action";
import { DraggableElement, HoverableElement } from "../types";

export class Node
  extends BaseElement
  implements DraggableElement, HoverableElement
{
  id: string;
  radius: number;
  color: string;
  dragOffsetX: number;
  dragOffsetY: number;
  isHovered: boolean = false;
  contextMenuActions: IMenuAction[] = [];

  constructor({
    id,
    x,
    y,
    width,
    height,
    color,
    contextMenuActions,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    contextMenuActions?: IMenuAction[];
  }) {
    super(id, x, y, width, height);
    this.radius = 10;
    this.color = color;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.contextMenuActions = contextMenuActions || [];
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Add a shadow to the node
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius, this.y);
    ctx.lineTo(this.x + this.width - this.radius, this.y);
    ctx.quadraticCurveTo(
      this.x + this.width,
      this.y,
      this.x + this.width,
      this.y + this.radius
    );
    ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
    ctx.quadraticCurveTo(
      this.x + this.width,
      this.y + this.height,
      this.x + this.width - this.radius,
      this.y + this.height
    );
    ctx.lineTo(this.x + this.radius, this.y + this.height);
    ctx.quadraticCurveTo(
      this.x,
      this.y + this.height,
      this.x,
      this.y + this.height - this.radius
    );
    ctx.lineTo(this.x, this.y + this.radius);
    ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
    ctx.closePath();

    ctx.fill();

    // Add a white border around the node
    ctx.strokeStyle = "white";
    ctx.lineWidth = this.isHovered ? 2 : 1;
    ctx.stroke();
  }

  onHover() {
    this.isHovered = true;
  }

  hoverOff() {
    this.isHovered = false;
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

  getContextMenuActions(): IMenuAction[] {
    return this.contextMenuActions;
  }
}

export default Node;
