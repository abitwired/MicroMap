export interface CanvasElement {
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint(x: number, y: number): boolean;
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
