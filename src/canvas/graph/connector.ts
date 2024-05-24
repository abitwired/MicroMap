/**
 * A dot that - when clicked - starts a connection between two nodes. When a
 * connection is started, a line is drawn between the two nodes until the
 * connection is completed by clicking on another NodeConnector.
 */
export class Connector {
  /**
   * The x-coordinate of the node connector.
   */
  x: number;

  /**
   * The y-coordinate of the node connector.
   */
  y: number;

  /**
   * The radius of the node connector.
   */
  radius: number;

  /**
   * The color of the node connector.
   */
  color: string;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  containsPoint(worldX: number, worldY: number) {
    const dx = this.x - worldX;
    const dy = this.y - worldY;
    return Math.sqrt(dx * dx + dy * dy) < this.radius;
  }

  /**
   * Draws the node connector on the canvas.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 1, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
