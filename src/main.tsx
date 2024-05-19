import { Canvas } from "./canvas/canvas";
import { Sidebar } from "./components/sidebar/Sidebar";

export const Main = () => {
  return (
    <div className="flex m-2 gap-2">
      <Sidebar />
      <div className="flex justify-between">
        <Canvas />
      </div>
    </div>
  );
};

export default Main;
