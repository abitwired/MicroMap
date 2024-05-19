import { useState } from "react";
import MenuAction, { IMenuAction, MenuActionProps } from "./menu-action";

export interface IContextMenu extends JSX.Element {
  show(worldX: number, worldY: number): void;
  hide(): void;
  updateActions(newActions: IMenuAction[]): void;
}

export const ContextMenu = (): IContextMenu => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [actions, setActions] = useState<IMenuAction[]>([]);
  const offsetPixels = 30;

  const show = (worldX: any, worldY: any) => {
    setCoordinates({
      x: worldX + offsetPixels,
      y: worldY + offsetPixels,
    });
    setIsVisible(true);
  };

  const hide = () => {
    setCoordinates({ x: 0, y: 0 });
    setIsVisible(false);
  };

  const updateActions = (newActions: IMenuAction[]) => {
    setActions(newActions);
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
    ...render(),
  };
};

export default ContextMenu;
