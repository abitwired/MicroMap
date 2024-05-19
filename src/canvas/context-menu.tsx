import { useState } from "react";
import Node from "./node";

export interface IContextMenu extends JSX.Element {
  show(node: Node): void;
  hide(): void;
}

export const ContextMenu = (): IContextMenu => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node>(null);

  const show = (node: Node) => {
    setSelectedNode(node);
    setCoordinates({
      x: node.x + node.width - 10,
      y: node.y + node.height - 10,
    });
    setIsVisible(true);
  };

  const hide = () => {
    setSelectedNode(null);
    setCoordinates({ x: 0, y: 0 });
    setIsVisible(false);
  };

  const render = () => (
    <div
      className={`absolute bg-gray-900 rounded-md border border-gray-200 shadow-lg ${
        isVisible ? "" : "hidden"
      }`}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul>
        <li>
          <button className="w-full px-4 py-2 text-sm text-left">Copy</button>
        </li>
        <li>
          <button className="w-full px-4 py-2 text-sm text-left">Paste</button>
        </li>
        <li>
          <button className="w-full px-4 py-2 text-sm text-left">Delete</button>
        </li>
      </ul>
    </div>
  );

  return {
    show,
    hide,
    ...render(),
  };
};

export default ContextMenu;
