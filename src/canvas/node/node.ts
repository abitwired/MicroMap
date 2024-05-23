import BaseElement from "../base-element";
import { DraggableElement, HoverableElement } from "../types";
import ConnectionCurve from "./connection-curve";
import { NodeConnector } from "./node-connector";

/**
 * Represents a node in the canvas.
 */
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
  intoNodeConnection: NodeConnector = null;
  outNodeConnection: NodeConnector = null;
  outConnections: Node[] = [];

  /**
   * Creates a new instance of the Node class.
   * @param id - The unique identifier of the node.
   * @param x - The x-coordinate of the node.
   * @param y - The y-coordinate of the node.
   * @param width - The width of the node.
   * @param height - The height of the node.
   * @param color - The color of the node.
   */
  constructor({
    id,
    x,
    y,
    width,
    height,
    color,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }) {
    super(id, x, y, width, height);
    this.radius = 10;
    this.color = color;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.intoNodeConnection = new NodeConnector(
      this.x,
      this.y + this.height / 2,
      this.radius,
      this.color
    );
    this.outNodeConnection = new NodeConnector(
      this.x + this.width,
      this.y + this.height / 2,
      this.radius,
      this.color
    );
  }

  /**
   * Draws the node on the canvas.
   * @param ctx - The canvas rendering context.
   */
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

    if (this.isHovered) {
      this.intoNodeConnection.draw(ctx);
      this.outNodeConnection.draw(ctx);
    }

    // Draw the node's connections
    this.outConnections.forEach((node) => {
      const curve = new ConnectionCurve({
        startX: this.outNodeConnection.x,
        startY: this.outNodeConnection.y,
        controlPoint1X: this.outNodeConnection.x + 50,
        controlPoint1Y: this.outNodeConnection.y,
        controlPoint2X: node.intoNodeConnection.x - 50,
        controlPoint2Y: node.intoNodeConnection.y,
        endX: node.intoNodeConnection.x,
        endY: node.intoNodeConnection.y,
        color: "white",
        width: 3,
        dash: [],
      });
      curve.draw(ctx);
    });
  }

  /**
   * Sets the node as hovered.
   */
  onHover() {
    this.isHovered = true;
  }

  /**
   * Sets the node as not hovered.
   */
  hoverOff() {
    this.isHovered = false;
  }

  /**
   * Sets the drag start position for the node.
   * @param x - The x-coordinate of the drag start position.
   * @param y - The y-coordinate of the drag start position.
   */
  onDragStart(x: number, y: number) {
    this.dragOffsetX = x - this.x;
    this.dragOffsetY = y - this.y;
  }

  /**
   * Moves the node during dragging.
   * @param x - The x-coordinate of the current position.
   * @param y - The y-coordinate of the current position.
   */
  onDragMove(x: number, y: number) {
    this.x = x - this.dragOffsetX;
    this.y = y - this.dragOffsetY;
    this.intoNodeConnection.x = this.x;
    this.intoNodeConnection.y = this.y + this.height / 2;
    this.outNodeConnection.x = this.x + this.width;
    this.outNodeConnection.y = this.y + this.height / 2;
  }

  /**
   * Resets the drag offset after dragging ends.
   */
  onDragEnd() {
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  setHeight(height: number) {
    this.height = height;
  }
}

export default Node;
