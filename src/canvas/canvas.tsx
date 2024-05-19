import { useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "./infinite-canvas";
import { Text } from "./text";
import { ContextMenu, IContextMenu } from "./context-menu/context-menu";
import { ILoadingIcon, LoadingIcon } from "./loading-icon";
import { IAddNodeForm, AddNodeForm } from "./node/add-node-form";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextMenuRef = useRef<IContextMenu>();
  const loadingRef = useRef<ILoadingIcon>();
  const addNodeFormRef = useRef<IAddNodeForm>();

  const [canvas, setCanvas] = useState<InfiniteCanvas | null>(null);

  contextMenuRef.current = ContextMenu();
  loadingRef.current = LoadingIcon();
  addNodeFormRef.current = AddNodeForm({ canvas });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new InfiniteCanvas(
        canvasRef.current,
        contextMenuRef.current,
        loadingRef.current,
        addNodeFormRef.current
      );
      const node = new Text({
        id: "text-element-1",
        x: 100,
        y: 300,
        width: 175,
        height: 50,
        text: "hello world #1",
        color: "#444",
        fontColor: "white",
        canvas,
      });

      const node2 = new Text({
        id: "text-element-2",
        x: 100,
        y: 300,
        width: 175,
        height: 50,
        text: "hello world #2",
        color: "#444",
        fontColor: "white",
        canvas,
      });

      canvas.addElement(node);
      canvas.addElement(node2);
      setCanvas(canvas);
    }
  }, [canvasRef]);

  return (
    <>
      {contextMenuRef.current}
      <div>
        {loadingRef.current}
        {addNodeFormRef.current}
        <canvas
          id="canvas"
          className="w-full rounded-md"
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
};

export default Canvas;
