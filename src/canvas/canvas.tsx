import { useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "./infinite-canvas";
import { Text } from "./text";
import { ContextMenu, IContextMenu } from "./context-menu/context-menu";
import MenuAction from "./context-menu/menu-action";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextMenuRef = useRef<IContextMenu>();
  const [canvas, setCanvas] = useState<InfiniteCanvas | null>(null);

  contextMenuRef.current = ContextMenu();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new InfiniteCanvas(
        canvasRef.current,
        contextMenuRef.current
      );
      const node = new Text({
        id: "text-element-1",
        x: 100,
        y: 300,
        width: 175,
        height: 50,
        text: "hello world",
        color: "#444",
        fontColor: "white",
        contextMenuActions: [
          MenuAction({
            name: "Delete",
            onClick: () => {
              canvas.deleteElement("text-element-1");
              contextMenuRef.current?.hide();
            },
          }),
        ],
      });

      const node2 = new Text({
        id: "text-element-2",
        x: 100,
        y: 300,
        width: 175,
        height: 50,
        text: "hello world",
        color: "#444",
        fontColor: "white",
        contextMenuActions: [
          MenuAction({
            name: "Delete",
            onClick: () => {
              canvas.deleteElement("text-element-2");
              contextMenuRef.current?.hide();
            },
          }),
        ],
      });

      canvas.addElement(node);
      canvas.addElement(node2);
      setCanvas(canvas);
    }
  }, [canvasRef]);

  return (
    <>
      {contextMenuRef.current}
      <canvas
        id="canvas"
        className="w-full rounded-md"
        ref={canvasRef}
      ></canvas>
    </>
  );
};

export default Canvas;
