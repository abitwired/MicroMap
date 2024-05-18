export interface CanvasElement {
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint(x: number, y: number): boolean;
  onDragStart(x: number, y: number): void;
  onDragMove(x: number, y: number): void;
  onDragEnd(): void;
}

export type EditableCanvasElement = CanvasElement & {
  containsTextPoint(x: number, y: number): boolean;
  startEditingText(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number,
    scale: number
  ): void;
};
