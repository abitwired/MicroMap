/**
 * Represents a curve connecting two nodes.
 */
export class ConnectionCurve {
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
  controlPoint1X: number = 0;
  /**
   * The y-coordinate of the first control point of the curve.
   */
  controlPoint1Y: number = 0;
  /**
   * The x-coordinate of the second control point of the curve.
   */
  controlPoint2X: number = 0;
  /**
   * The y-coordinate of the second control point of the curve.
   */
  controlPoint2Y: number = 0;
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
   * Whether the curve is selected.
   */
  selected: boolean = false;
  /**
   * The bezier curve of the connection.
   */
  bezierCurve: CanvasPath = null;

  constructor({
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
      ctx.lineWidth = this.width + 1;
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

export default ConnectionCurve;
