import { Canvas } from "./canvas/canvas";

export const Main = () => {
  return (
    <div className="p-2">
      <h1 className="text-4xl font-bold">Micro Map</h1>
      <div className="flex justify-between p-4">
        <Canvas />
      </div>
    </div>
  );
};

export default Main;
