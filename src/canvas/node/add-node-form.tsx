import { useState } from "react";
import { ServiceDefinition } from "./types";
import { Text } from "../text";
import { InfiniteCanvas } from "../infinite-canvas";

export interface IAddNodeForm extends JSX.Element {
  setVisibility(isVisible: boolean): void;
}

export type AddNodeFormProps = {
  canvas: InfiniteCanvas;
  existingServiceDefinition?: ServiceDefinition;
};

export const AddNodeForm = ({
  canvas,
  existingServiceDefinition,
}: AddNodeFormProps): IAddNodeForm => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(existingServiceDefinition.name || "");
  const [serviceType, setServiceType] = useState(
    existingServiceDefinition.type || ""
  );

  const setVisibility = (isVisible: boolean) => {
    setIsVisible(isVisible);
  };

  const clearForm = () => {
    setName("");
    setServiceType("");
  };

  const onSubmit = () => {
    const worldCoordinates = canvas.getWorldCoordinates();
    const id = `${name}-${new Date()}`;
    // const length = Math.min(250, Math.max(name.length * 10, 100));
    const node = new Text({
      id: id,
      x: worldCoordinates.x,
      y: worldCoordinates.y,
      width: 250,
      height: 50,
      text: name,
      color: "#444",
      fontColor: "white",
      canvas,
    });

    canvas.addElement(node);
    setVisibility(false);
    clearForm();
  };

  const render = () => (
    <div
      className={`absolute w-full h-full bg-slate-800/75 rounded-md ${
        isVisible ? "" : "hidden"
      }`}
    >
      <div
        id="add-node-form"
        className={`absolute p-5 top-1/2 left-1/2 transform w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2
    `}
      >
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="node-name"
            >
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="node-name"
              type="text"
              placeholder="Node name"
              value={name}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return {
    setVisibility,
    ...render(),
  };
};

export default AddNodeForm;
