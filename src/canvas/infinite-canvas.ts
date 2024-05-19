import { IContextMenu } from "./context-menu/context-menu";
import MenuAction from "./context-menu/menu-action";
import { ILoadingIcon } from "./loading-icon";
import { IAddNodeForm } from "./node/add-node-form";
import Node from "./node/node";
import { CanvasElement, DraggableElement, HoverableElement } from "./types";

/**
 * Represents an infinite canvas that allows panning, zooming, and drawing elements.
 */
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
  saveInterval: NodeJS.Timeout | null;
  savePendingInterval: NodeJS.Timeout | null;
  loadingIcon: ILoadingIcon;
  addNodeForm: IAddNodeForm;
  worldX: number;
  worldY: number;

  constructor(
    canvas: HTMLCanvasElement,
    contextMenu: IContextMenu,
    loadingIcon: ILoadingIcon,
    addNodeForm: IAddNodeForm
  ) {
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
    this.loadingIcon = loadingIcon;
    this.addNodeForm = addNodeForm;

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

    this.draw();
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  /**
   * Displays the context menu on the canvas at the specified coordinates.
   *
   * @param x - The x-coordinate of the context menu.
   * @param y - The y-coordinate of the context menu.
   * @param worldX - The x-coordinate of the context menu in world coordinates.
   * @param worldY - The y-coordinate of the context menu in world coordinates.
   */
  canvasContextMenu(x: number, y: number, worldX: number, worldY: number) {
    const actions = [
      MenuAction({
        name: "Add Node",
        onClick: () => {
          this.addNodeForm.setVisibility(true);
          this.contextMenu.hide();
        },
      }),
    ];

    this.contextMenu.updateActions(actions);
    this.contextMenu.show(x, y);
  }

  /**
   * Hides the context menu.
   */
  hideContextMenu() {
    this.contextMenu.hide();
  }

  /**
   * Sets the context menu for a given node at the specified world coordinates.
   * @param node - The node for which to set the context menu.
   * @param worldX - The x-coordinate in the world space.
   * @param worldY - The y-coordinate in the world space.
   */
  setContextMenu(node: Node, worldX: number, worldY: number) {
    const actions = node.getContextMenuActions();
    if (actions.length > 0) {
      this.contextMenu.updateActions(actions);
      this.contextMenu.show(worldX, worldY);
    }
  }

  /**
   * Deletes an element from the canvas.
   *
   * @param elementId - The ID of the element to delete.
   */
  deleteElement(elementId: string) {
    this.elements = this.elements.filter(
      (element) => element.getId() !== elementId
    );
    this.draw();
    this.save();
  }

  /**
   * Handles the mouse down event on the canvas.
   *
   * @param event - The mouse event object.
   */
  onMouseDown(event: MouseEvent) {
    const { clientX, clientY } = event;
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const worldX = (canvasX - this.offsetX) / this.scale;
    const worldY = (canvasY - this.offsetY) / this.scale;
    this.worldX = worldX;
    this.worldY = worldY;

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

  /**
   * Handles the mouse move event on the canvas.
   * Updates the cursor style, performs panning or dragging of elements,
   * and checks if the cursor is hovering over an element.
   * @param event - The mouse move event.
   */
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

  /**
   * Handles the mouse up event.
   */
  onMouseUp() {
    this.canvas.style.cursor = "default";
    if (this.isPanning) {
      this.isPanning = false;
    }
    if (this.draggingElement) {
      this.draggingElement.onDragEnd();
      this.save();
      this.draggingElement = null;
    }
  }

  /**
   * Zooms the canvas based on the provided wheel event.
   * @param event - The wheel event.
   */
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

  /**
   * Adds a canvas element to the infinite canvas.
   * @param element - The canvas element to be added.
   */
  addElement(element: CanvasElement) {
    this.elements.push(element);
    this.draw();
    this.save();
  }

  getWorldCoordinates() {
    return { x: this.worldX, y: this.worldY };
  }

  /**
   * Draws a grid on the canvas.
   */
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

  /**
   * Draws all the elements on the canvas.
   */
  drawElements() {
    this.elements.forEach((element) => {
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
      element.draw(this.ctx);
      this.ctx.restore();
    });
  }

  /**
   * Clears the canvas and redraws the grid and elements.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set the background color to #333
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawElements();
  }

  /**
   * Saves the current state of the canvas.
   */
  save() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }

    if (this.savePendingInterval) {
      clearInterval(this.savePendingInterval);
    }

    this.savePendingInterval = setTimeout(() => {
      this.loadingIcon.setVisibility(true);

      this.saveInterval = setTimeout(() => {
        this.loadingIcon.setVisibility(false);
      }, 5_000);
    }, 5_000);
  }
}

export default InfiniteCanvas;
