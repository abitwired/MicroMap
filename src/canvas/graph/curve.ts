import { IMenuAction } from "../context-menu/menu-action";
import { InfiniteCanvas } from "../infinite-canvas";
import { CanvasElement } from "../types";

/**
 * Represents a curve connecting two nodes.
 */
export class Curve implements CanvasElement {
  /**
   * The unique identifier of the curve.
   */
  id: string;
  /**
   * The x-coordinate of the start point of the curve.
   */
  startX: number = 0;
  /**
   * The y-coordinate of the start point of the curve.
   */
  startY: number = 0;
  /**
   * The x-coordinate of the first control point of the curve.
   */
  controlPoint1X?: number = 0;
  /**
   * The y-coordinate of the first control point of the curve.
   */
  controlPoint1Y?: number = 0;
  /**
   * The x-coordinate of the second control point of the curve.
   */
  controlPoint2X?: number = 0;
  /**
   * The y-coordinate of the second control point of the curve.
   */
  controlPoint2Y?: number = 0;
  /**
   * The x-coordinate of the end point of the curve.
   */
  endX: number = 0;
  /**
   * The y-coordinate of the end point of the curve.
   */
  endY: number = 0;
  /**
   * The color of the curve.
   */
  color: string = "#fff";
  /**
   * The width of the curve.
   */
  width: number = 3;
  /**
   * The dash pattern of the curve.
   */
  dash: number[] = [];
  /**
   * The bezier curve of the connection.
   */
  bezierCurve: CanvasPath = null;
  /**
   * Indicates if the curve is selected.
   */
  selected: boolean = false;

  constructor({
    id,
    startX = 0,
    startY = 0,
    controlPoint1X = 0,
    controlPoint1Y = 0,
    controlPoint2X = 0,
    controlPoint2Y = 0,
    endX = 0,
    endY = 0,
    color = "#fff",
    width = 3,
    dash = [],
  }: {
    id: string;
    startX: number;
    startY: number;
    controlPoint1X: number;
    controlPoint1Y: number;
    controlPoint2X: number;
    controlPoint2Y: number;
    endX: number;
    endY: number;
    color: string;
    width: number;
    dash: number[];
  }) {
    this.id = id;
    this.startX = startX;
    this.startY = startY;
    this.controlPoint1X = controlPoint1X;
    this.controlPoint1Y = controlPoint1Y;
    this.controlPoint2X = controlPoint2X;
    this.controlPoint2Y = controlPoint2Y;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.width = width;
    this.dash = dash;
  }

  getId(): string {
    return this.id;
  }

  containsPoint(x: number, y: number): boolean {
    console.warn("Method not implemented.");
    return false;
  }

  pathContainsPoint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): boolean {
    // Create s-shape curve between the two points
    ctx.beginPath();
    ctx.strokeStyle = this.color;

    ctx.lineWidth = this.width + 5;

    ctx.setLineDash(this.dash);
    ctx.moveTo(this.startX, this.startY);

    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    // if dy is negative, the curve will be an s-shape
    // if dy is positive, we should flip the s-shape curve

    const controlPointFactor = Math.abs(dy) * 0.5;

    const x1 = this.startX + dx * 0.5;
    const y1 =
      this.startY +
      dy * 0.5 +
      (dy > 0 ? -controlPointFactor : controlPointFactor);
    const x2 = this.startX + dx * 0.5;
    const y2 =
      this.startY +
      dy * 0.5 +
      (dy > 0 ? controlPointFactor : -controlPointFactor);

    ctx.bezierCurveTo(x1, y1, x2, y2, this.endX, this.endY);

    return ctx.isPointInStroke(x, y);
  }

  getActions(canvas: InfiniteCanvas): IMenuAction[] {
    console.warn("Method not implemented.");
    return [];
  }

  fromJSON(json: any): CanvasElement {
    console.warn("Method not implemented.");
    return null;
  }

  setSelected(selected: boolean) {
    this.selected = selected;
  }

  /**
   * Draws the curve on the canvas.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    // Create s-shape curve between the two points
    ctx.beginPath();
    ctx.strokeStyle = this.color;

    if (this.selected) {
      ctx.lineWidth = this.width + 5;
      ctx.strokeStyle = "#f00";
    } else {
      ctx.lineWidth = this.width;
    }

    ctx.setLineDash(this.dash);
    ctx.moveTo(this.startX, this.startY);

    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;

    // if dy is negative, the curve will be an s-shape
    // if dy is positive, we should flip the s-shape curve

    const controlPointFactor = Math.abs(dy) * 0.5;

    const x1 = this.startX + dx * 0.5;
    const y1 =
      this.startY +
      dy * 0.5 +
      (dy > 0 ? -controlPointFactor : controlPointFactor);
    const x2 = this.startX + dx * 0.5;
    const y2 =
      this.startY +
      dy * 0.5 +
      (dy > 0 ? controlPointFactor : -controlPointFactor);

    ctx.bezierCurveTo(x1, y1, x2, y2, this.endX, this.endY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export default Curve;
