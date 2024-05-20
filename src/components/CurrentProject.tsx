import { useContext } from "react";
import { AppContext } from "../store/app-provider";
import Canvas from "../canvas/canvas";
import { Box } from "react-feather";

export const CurrentProject = () => {
  const { state } = useContext(AppContext);

  if (state.app?.currentProject === undefined) {
    return (
      <div className="flex justify-center text-center items-center h-screen w-full bg-zinc-800">
        <div>
          <Box
            size={128}
            className="text-white mb-4 mx-auto
          "
          />
          <h1 className="text-4xl text-white">Welcome to MicroMap</h1>
          <p className="text-white text-lg">
            Select a project or create a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <Canvas />
    </div>
  );
};
