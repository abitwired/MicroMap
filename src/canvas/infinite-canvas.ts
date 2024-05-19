import { IContextMenu } from "./context-menu/context-menu";
import MenuAction from "./context-menu/menu-action";
import Node from "./node/node";
import { CanvasElement, DraggableElement, HoverableElement } from "./types";

export class InfiniteCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  elements: CanvasElement[];
  scale: number;
  offsetX: number;
  offsetY: number;
  isPanning: boolean;
  startX: number;
  startY: number;
  draggingElement: DraggableElement | null;
  contextMenu: IContextMenu;

  constructor(canvas: HTMLCanvasElement, contextMenu: IContextMenu) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.elements = [];
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.draggingElement = null;
    this.contextMenu = contextMenu;

    this.initialize();
  }

  initialize() {
    window.addEventListener("resize", () => this.resizeCanvas());
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("wheel", (e) => this.zoom(e), {
      passive: false,
    });

    this.resizeCanvas();
    this.draw();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  canvasContextMenu(x: number, y: number, worldX: number, worldY: number) {
    const actions = [
      MenuAction({
        name: "Add Node",
        onClick: () => {
          const node = new Node({
            id: `node-${Date.now()}`,
            x: worldX,
            y: worldY,
            width: 100,
            height: 50,
            color: "#444",
            contextMenuActions: [
              MenuAction({
                name: "Delete",
                onClick: () => {
                  this.deleteElement(node.getId());
                  this.contextMenu.hide();
                },
              }),
            ],
          });
          this.addElement(node);
          this.contextMenu.hide();
        },
      }),
    ];

    this.contextMenu.updateActions(actions);
    this.contextMenu.show(x, y);
  }

  setContextMenu(node: Node, worldX: number, worldY: number) {
    const actions = node.getContextMenuActions();
    if (actions.length > 0) {
      this.contextMenu.updateActions(actions);
      this.contextMenu.show(worldX, worldY);
    }
  }

  deleteElement(elementId: string) {
    this.elements = this.elements.filter(
      (element) => element.getId() !== elementId
    );
    this.draw();
  }

  onMouseDown(event: MouseEvent) {
    const { clientX, clientY } = event;
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const worldX = (canvasX - this.offsetX) / this.scale;
    const worldY = (canvasY - this.offsetY) / this.scale;

    if (event.button === 0) {
      // Hide context menu on left click
      this.contextMenu.hide();
    } else if (event.button === 2) {
      // Show context menu on right click
      for (const element of this.elements) {
        if (element.containsPoint(worldX, worldY)) {
          this.setContextMenu(element as Node, canvasX, canvasY);
          return;
        }
      }

      this.canvasContextMenu(canvasX, canvasY, worldX, worldY);
      return;
    }

    // Set cursor to grabbing
    this.canvas.style.cursor = "grabbing";

    for (const element of this.elements) {
      if (element.containsPoint(worldX, worldY)) {
        if ("onDragStart" in element) {
          const draggableElement = element as unknown as DraggableElement;
          this.draggingElement = draggableElement;
          draggableElement.onDragStart(worldX, worldY);
          return;
        }
      }
    }

    this.isPanning = true;
    this.startX = canvasX - this.offsetX;
    this.startY = canvasY - this.offsetY;
  }

  onMouseMove(event: MouseEvent) {
    this.canvas.style.cursor = "default";
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    if (this.isPanning) {
      this.canvas.style.cursor = "grabbing";

      this.offsetX = canvasX - this.startX;
      this.offsetY = canvasY - this.startY;
    } else if (this.draggingElement) {
      this.canvas.style.cursor = "grabbing";
      const worldX = (canvasX - this.offsetX) / this.scale;
      const worldY = (canvasY - this.offsetY) / this.scale;
      this.draggingElement.onDragMove(worldX, worldY);
    } else {
      // Check if the cursor is hovering over an element
      const worldX = (canvasX - this.offsetX) / this.scale;
      const worldY = (canvasY - this.offsetY) / this.scale;

      for (const element of this.elements) {
        if (element.containsPoint(worldX, worldY)) {
          this.canvas.style.cursor = "pointer";
          if ("onHover" in element) {
            const draggableElement = element as unknown as HoverableElement;
            draggableElement.onHover();
          }
        } else {
          if ("hoverOff" in element) {
            const draggableElement = element as unknown as HoverableElement;
            draggableElement.hoverOff();
          }
        }
      }
    }

    this.draw();
  }

  onMouseUp() {
    this.canvas.style.cursor = "default";
    if (this.isPanning) {
      this.isPanning = false;
    }
    if (this.draggingElement) {
      this.draggingElement.onDragEnd();
      this.draggingElement = null;
    }
  }

  zoom(event: WheelEvent) {
    event.preventDefault();
    const scaleFactor = 1.1;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const zoomIn = event.deltaY < 0;

    const worldX = (mouseX - this.offsetX) / this.scale;
    const worldY = (mouseY - this.offsetY) / this.scale;

    this.scale *= zoomIn ? scaleFactor : 1 / scaleFactor;

    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;

    this.draw();
  }

  addElement(element: CanvasElement) {
    this.elements.push(element);
    this.draw();
  }

  drawGrid() {
    const gridSize = 50;

    // add dots
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (
      let x = -this.offsetX % gridSize;
      x < this.canvas.width;
      x += gridSize
    ) {
      for (
        let y = -this.offsetY % gridSize;
        y < this.canvas.height;
        y += gridSize
      ) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  drawElements() {
    this.elements.forEach((element) => {
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
      element.draw(this.ctx);
      this.ctx.restore();
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set the background color to #333
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawElements();
  }
}

export default InfiniteCanvas;
