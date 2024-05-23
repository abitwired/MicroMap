import { IContextMenu } from "./context-menu/context-menu";
import MenuAction from "./context-menu/menu-action";
import { ILoadingIcon } from "./loading-icon";
import { IAddNodeForm } from "../components/forms/AddNodeForm";
import Node from "./node/node";
import { CanvasElement, DraggableElement, HoverableElement } from "./types";
import { Project } from "../store/types";
import { NodeConnector } from "./node/node-connector";
import ConnectionCurve from "./node/connection-curve";
import { Graph } from "../store/graph";

/**
 * Represents an infinite canvas that allows panning, zooming, and drawing elements.
 */
export class InfiniteCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  elements: CanvasElement[];
  scale: number;
  minScale: number;
  maxScale: number;
  offsetX: number;
  offsetY: number;
  isPanning: boolean;
  startX: number;
  startY: number;
  draggingElement: DraggableElement | null;
  creatingConnection: boolean = false;
  contextMenu: IContextMenu;
  saveInterval: NodeJS.Timeout | null;
  savePendingInterval: NodeJS.Timeout | null;
  loadingIcon: ILoadingIcon;
  addNodeForm: IAddNodeForm;
  connectingNode: Node | null;
  connectingNodeConnector: NodeConnector | null;
  connectionCurve: ConnectionCurve = new ConnectionCurve({
    startX: 0,
    startY: 0,
    controlPoint1X: 0,
    controlPoint1Y: 0,
    controlPoint2X: 0,
    controlPoint2Y: 0,
    endX: 0,
    endY: 0,
    color: "#f5f5f5",
    width: 3,
    dash: [],
  });
  worldX: number;
  worldY: number;

  constructor(
    project: Project,
    canvas: HTMLCanvasElement,
    contextMenu: IContextMenu,
    loadingIcon: ILoadingIcon,
    addNodeForm: IAddNodeForm
  ) {
    const graph = new Graph(project.graph.vertices);
    console.log(graph);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.elements = graph.convertGraphToCanvasElements() ?? [];
    this.scale = 1;
    this.minScale = 0.5;
    this.maxScale = 5;
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

  public getElements(): CanvasElement[] {
    return this.elements;
  }

  initialize() {
    window.addEventListener("resize", () => this.resizeCanvas(), false);
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

  /**
   * Displays the context menu on the canvas at the specified coordinates.
   *
   * @param x - The x-coordinate of the context menu.
   * @param y - The y-coordinate of the context menu.
   */
  canvasContextMenu(x: number, y: number) {
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
   * @param screenX - The x-coordinate in the screen space.
   * @param screenY - The y-coordinate in the screen space.
   */
  setContextMenu(node: Node, screenX: number, screenY: number) {
    const actions = this.contextMenu.getActions(node, this);
    if (actions.length > 0) {
      this.contextMenu.updateActions(actions);
      this.contextMenu.show(screenX, screenY);
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
  }

  startConnection(node: Node, worldX: number, worldY: number) {
    if (node.intoNodeConnection.containsPoint(worldX, worldY)) {
      this.connectingNode = node;
      this.connectingNodeConnector = node.intoNodeConnection;
      this.connectionCurve.startX = node.intoNodeConnection.x;
      this.connectionCurve.startY = node.intoNodeConnection.y;
    } else if (node.outNodeConnection.containsPoint(worldX, worldY)) {
      this.connectingNode = node;
      this.connectingNodeConnector = node.outNodeConnection;
      this.connectionCurve.startX = node.outNodeConnection.x;
      this.connectionCurve.startY = node.outNodeConnection.y;
    }
  }

  closeConnection(node: Node, worldX: number, worldY: number) {
    if (node !== this.connectingNode) {
      // The case where the connection starts from the intoNodeConnection
      // and ends at the outNodeConnection is called a "reverse connection"
      const isReverse =
        this.connectingNode.intoNodeConnection === this.connectingNodeConnector;
      if (isReverse) {
        if (!node.outConnections.includes(this.connectingNode)) {
          node.outConnections.push(this.connectingNode);
        }
      } else {
        if (!this.connectingNode.outConnections.includes(node)) {
          this.connectingNode.outConnections.push(node);
        }
      }
    } else {
      console.log("Cannot connect a node to itself.");
    }

    this.clearConnectionCurve();
  }

  clearConnectionCurve() {
    this.creatingConnection = false;
    this.connectingNode = null;
    this.connectingNodeConnector = null;
    this.connectionCurve.startX = 0;
    this.connectionCurve.startY = 0;
    this.connectionCurve.endX = 0;
    this.connectionCurve.endY = 0;
    this.connectionCurve.controlPoint1X = 0;
    this.connectionCurve.controlPoint1Y = 0;
    this.connectionCurve.controlPoint2X = 0;
    this.connectionCurve.controlPoint2Y = 0;
  }

  /**
   * Handles the mouse down event on the canvas.
   *
   * @param event - The mouse event object.
   */
  onMouseDown(event: MouseEvent) {
    const mouse = this.getMousePos(event);
    this.canvas.style.cursor = "default";

    const worldX = (mouse.x - this.offsetX) / this.scale;
    const worldY = (mouse.y - this.offsetY) / this.scale;
    this.worldX = worldX;
    this.worldY = worldY;

    if (event.button === 0) {
      // Hide context menu on left click
      this.contextMenu.hide();

      for (const element of this.elements) {
        if (element.containsPoint(worldX, worldY)) {
          // We've clicked on an NodeConnector
          if (element instanceof Node) {
            const node = element as Node;
            const clickedOnConnector =
              node.intoNodeConnection.containsPoint(worldX, worldY) ||
              node.outNodeConnection.containsPoint(worldX, worldY);
            if (clickedOnConnector && !this.creatingConnection) {
              this.creatingConnection = true;
              this.startConnection(node, worldX, worldY);
              return;
            } else if (clickedOnConnector && this.creatingConnection) {
              this.creatingConnection = false;
              this.closeConnection(node, worldX, worldY);
            }
          }
        }
      }
      this.clearConnectionCurve();
    } else if (event.button === 2) {
      this.clearConnectionCurve();

      // Show context menu on right click
      for (const element of this.elements) {
        if (element.containsPoint(worldX, worldY)) {
          this.setContextMenu(element as Node, event.clientX, event.clientY);
          return;
        }
      }

      this.canvasContextMenu(event.clientX, event.clientY);
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
    this.startX = mouse.x - this.offsetX;
    this.startY = mouse.y - this.offsetY;
  }

  /**
   * Gets the mouse position on the canvas.
   *
   * @param evt - The mouse event object.
   * @returns An object containing the x and y coordinates of the mouse.
   */
  getMousePos(evt: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x:
        ((evt.clientX - rect.left) / (rect.right - rect.left)) *
        this.canvas.width,
      y:
        ((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
        this.canvas.height,
    };
  }

  /**
   * Handles the mouse move event on the canvas.
   * Updates the cursor style, performs panning or dragging of elements,
   * and checks if the cursor is hovering over an element.
   * @param event - The mouse move event.
   */
  onMouseMove(event: MouseEvent) {
    const mouse = this.getMousePos(event);
    this.canvas.style.cursor = "default";

    const worldX = (mouse.x - this.offsetX) / this.scale;
    const worldY = (mouse.y - this.offsetY) / this.scale;

    if (this.isPanning) {
      this.canvas.style.cursor = "grabbing";

      this.offsetX = mouse.x - this.startX;
      this.offsetY = mouse.y - this.startY;
    } else if (this.draggingElement) {
      this.canvas.style.cursor = "grabbing";
      this.draggingElement.onDragMove(worldX, worldY);
    } else {
      // Check if the cursor is hovering over an element
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

    if (this.connectingNode) {
      this.connectionCurve.startX = this.connectingNodeConnector.x;
      this.connectionCurve.startY = this.connectingNodeConnector.y;
      this.connectionCurve.endX = worldX;
      this.connectionCurve.endY = worldY;
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
      this.draggingElement = null;
    }
  }

  /**    console.log(actions);

   * Zooms the canvas based on the provided wheel event.
   * @param event - The wheel event.
   */
  zoom(event: WheelEvent) {
    event.preventDefault();

    if (this.maxScale <= this.scale && event.deltaY < 0) return;
    if (this.minScale >= this.scale && event.deltaY > 0) return;

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
    this.drawConnectionCurve();
  }

  drawConnectionCurve() {
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    this.connectionCurve.draw(this.ctx);
    this.ctx.restore();
  }

  /**
   * Saves the current state of the canvas.
   */
  public save() {
    this.loadingIcon.setVisibility(true);

    this.saveInterval = setTimeout(() => {
      this.loadingIcon.setVisibility(false);
    }, 2_000);
  }
}

export default InfiniteCanvas;
