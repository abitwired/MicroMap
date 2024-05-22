import { useContext, useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "./infinite-canvas";
import { ContextMenu, IContextMenu } from "./context-menu/context-menu";
import { ILoadingIcon, LoadingIcon } from "./loading-icon";
import { IAddNodeForm, AddNodeForm } from "../components/forms/AddNodeForm";
import SaveProjectButton from "../components/sidebar/SaveProjectButton";
import { AppContext } from "../store/app-provider";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextMenuRef = useRef<IContextMenu>();
  const loadingRef = useRef<ILoadingIcon>();
  const addNodeFormRef = useRef<IAddNodeForm>();
  const { state } = useContext(AppContext);

  const [canvas, setCanvas] = useState<InfiniteCanvas | null>(null);

  contextMenuRef.current = ContextMenu();
  loadingRef.current = LoadingIcon();
  addNodeFormRef.current = AddNodeForm({ canvas });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new InfiniteCanvas(
        state.app?.currentProject,
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
        <div className="absolute top-4 right-4">
          <SaveProjectButton canvas={canvas} size={32} />
        </div>
        <canvas
          id="canvas"
          className="rounded-md w-full"
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
};

export default Canvas;
