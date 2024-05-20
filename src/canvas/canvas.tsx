import { useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "./infinite-canvas";
import { Text } from "./text";
import { ContextMenu, IContextMenu } from "./context-menu/context-menu";
import { ILoadingIcon, LoadingIcon } from "./loading-icon";
import { IAddNodeForm, AddNodeForm } from "../components/forms/AddNodeForm";

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
          className="w-full rounded-md h-dvh"
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
};

export default Canvas;
