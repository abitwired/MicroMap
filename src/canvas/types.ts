import { IMenuAction } from "./context-menu/menu-action";

export interface CanvasElement {
  getId(): string;
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint(x: number, y: number): boolean;
  getContextMenuActions(): IMenuAction[];
}

export interface DraggableElement {
  onDragStart(x: number, y: number): void;
  onDragMove(x: number, y: number): void;
  onDragEnd(): void;
}

export interface TextElement {}

export interface HoverableElement {
  onHover(): void;
  hoverOff(): void;
}
