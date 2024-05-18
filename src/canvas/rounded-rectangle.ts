import { CanvasElement } from "./types";

export class RoundedRectangle implements CanvasElement {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  text: string;
  color: string;
  textColor: string;
  dragOffsetX: number;
  dragOffsetY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    text: string,
    color: string,
    textColor: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.text = text;
    this.color = color;
    this.textColor = textColor;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
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

    ctx.fillStyle = this.textColor;
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  containsPoint(x: number, y: number) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  containsTextPoint(x: number, y: number) {
    const textPadding = 10;
    const textX = this.x + this.width / 2;
    const textY = this.y + this.height / 2;
    const textWidth = this.width - 2 * textPadding;
    const textHeight = 24; // Approximate text height

    return (
      x >= textX - textWidth / 2 &&
      x <= textX + textWidth / 2 &&
      y >= textY - textHeight / 2 &&
      y <= textY + textHeight / 2
    );
  }

  startEditingText(canvas, ctx, offsetX, offsetY, scale) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = this.text;
    input.style.position = "absolute";
    input.style.left = `${this.x * scale + offsetX + canvas.offsetLeft}px`;
    input.style.top = `${this.y * scale + offsetY + canvas.offsetTop}px`;
    input.style.width = `${this.width * scale}px`;
    input.style.height = `${this.height * scale}px`;
    input.style.fontSize = `${16 * scale}px`;
    input.style.padding = "0";
    input.style.margin = "0";
    input.style.border = "none";
    input.style.background = "transparent";
    input.style.color = this.textColor;
    input.style.textAlign = "center";
    input.style.zIndex = "1000";

    canvas.parentNode.appendChild(input);

    input.focus();

    input.addEventListener("blur", () => {
      this.text = input.value;
      canvas.parentNode.removeChild(input);
      ctx.canvas.dispatchEvent(new Event("draw")); // Trigger a redraw of the canvas
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        input.blur();
      }
    });
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
}

export default RoundedRectangle;
