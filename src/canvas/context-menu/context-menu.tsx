import { useState } from "react";
import { IMenuAction } from "./menu-action";
import { Vertex } from "../graph/vertex";
import InfiniteCanvas from "../infinite-canvas";
import { Edge } from "../graph/edge";

export interface IContextMenu extends JSX.Element {
  show(worldX: number, worldY: number): void;
  hide(): void;
  updateActions(newActions: IMenuAction[]): void;
  getActions(node: Vertex | Edge, canvas: InfiniteCanvas): IMenuAction[];
}

/**
 * Represents a context menu component.
 *
 * @returns An object containing functions to show, hide, and update the context menu, as well as the rendered JSX.
 */
export const ContextMenu = (): IContextMenu => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [actions, setActions] = useState<IMenuAction[]>([]);

  /**
   * Displays the context menu at the specified coordinates.
   *
   * @param {number} worldX - The x-coordinate in the world space.
   * @param {number} worldY - The y-coordinate in the world space.
   */
  const show = (worldX: number, worldY: number) => {
    setCoordinates({
      x: worldX,
      y: worldY,
    });
    setIsVisible(true);
  };

  /**
   * Hides the context menu and resets the coordinates.
   */
  const hide = () => {
    setCoordinates({ x: 0, y: 0 });
    setIsVisible(false);
  };

  /**
   * Updates the actions of the context menu.
   *
   * @param {IMenuAction[]} newActions - The new actions to set.
   */
  const updateActions = (newActions: IMenuAction[]) => {
    setActions(newActions);
  };

  const getActions = (node: Vertex, canvas: InfiniteCanvas): IMenuAction[] => {
    return node.getActions(canvas);
  };

  const render = () => (
    <div
      className={`absolute p-1 min-w-[100px] bg-gray-600 rounded-md border border-gray-200 shadow-lg ${
        isVisible ? "" : "hidden"
      }`}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul>{...actions}</ul>
    </div>
  );

  return {
    show,
    hide,
    updateActions,
    getActions,
    ...render(),
  };
};

export default ContextMenu;
