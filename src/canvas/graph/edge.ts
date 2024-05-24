import MenuAction, { IMenuAction } from "../context-menu/menu-action";
import InfiniteCanvas from "../infinite-canvas";
import { HoverableElement } from "../types";
import { Curve } from "./curve";
import { Vertex } from "./vertex";

export class Edge implements HoverableElement {
  id: string;
  start: Vertex;
  end: Vertex;
  selected: boolean = false;

  constructor({ start, end }: { start: Vertex; end: Vertex }) {
    this.id = `${start.id}-${end.id}`;
    this.start = start;
    this.end = end;
  }

  onHover(): void {
    this.selected = true;
  }

  hoverOff(): void {
    this.selected = false;
  }

  public getActions(canvas: InfiniteCanvas): IMenuAction[] {
    const deleteAction: IMenuAction = MenuAction({
      name: "Delete",
      onClick: () => {
        canvas.hideContextMenu();
        canvas.deleteEdge(this.id);
      },
    });
    return [deleteAction];
  }

  containsPoint(ctx: CanvasRenderingContext2D, worldX: number, worldY: number) {
    const drawCurve = new Curve({
      id: `${this.start.id}-${this.end.id}`,
      startX: this.start.outConnector.x,
      startY: this.start.outConnector.y,
      controlPoint1X: 0,
      controlPoint1Y: 0,
      controlPoint2X: 0,
      controlPoint2Y: 0,
      endX: this.end.inConnector.x,
      endY: this.end.inConnector.y,
      color: "#fff",
      width: 3,
      dash: [],
    });

    return drawCurve.pathContainsPoint(ctx, worldX, worldY);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawCurve = new Curve({
      id: `${this.start.id}-${this.end.id}`,
      startX: this.start.outConnector.x,
      startY: this.start.outConnector.y,
      controlPoint1X: 0,
      controlPoint1Y: 0,
      controlPoint2X: 0,
      controlPoint2Y: 0,
      endX: this.end.inConnector.x,
      endY: this.end.inConnector.y,
      color: "#fff",
      width: 3,
      dash: [],
    });

    drawCurve.setSelected(this.selected);

    drawCurve.draw(ctx);
  }
}
