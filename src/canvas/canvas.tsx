import { useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "./infinite-canvas";
import { Rectangle } from "./rectangle";
import RoundedRectangle from "./rounded-rectangle";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<InfiniteCanvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new InfiniteCanvas(canvasRef.current);
      canvas.addElement(
        new RoundedRectangle(100, 300, 200, 100, 10, "Hello", "green", "white")
      );
      setCanvas(canvas);
    }
  }, [canvasRef]);

  return (
    <canvas id="canvas" className="w-full rounded-md" ref={canvasRef}></canvas>
  );
};

export default Canvas;
