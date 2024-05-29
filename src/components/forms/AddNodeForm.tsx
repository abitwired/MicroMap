import { useEffect, useState } from "react";
import { Node as VisualNode } from "../../canvas/graph/node";
import { InfiniteCanvas } from "../../canvas/infinite-canvas";
import { PlusCircle } from "react-feather";

export interface IAddNodeForm extends JSX.Element {
  setVisibility(isVisible: boolean): void;
}

export type AddNodeFormProps = {
  canvas: InfiniteCanvas;
  node?: string;
};

const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

export const AddNodeForm = ({
  canvas,
  node,
}: AddNodeFormProps): IAddNodeForm => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(node ?? "");
  const [image, setImage] = useState<string | null>(null);
  const [ports, setPorts] = useState<number[]>([]);
  const [portInputs, setPortInputs] = useState<number[]>([]);

  useEffect(() => {
    // Hide form when clicking outside of it
    const handleClick = (e: MouseEvent) => {
      const form = document.getElementById("add-node-form");
      if (form && !form.contains(e.target as Node)) {
        setVisibility(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
  }, []);

  const setVisibility = (isVisible: boolean) => {
    setIsVisible(isVisible);
  };

  const clearForm = () => {
    setName("");
  };

  const onSubmit = () => {
    const worldCoordinates = canvas.getWorldCoordinates();
    const id = uuidv4();
    
    const node = new VisualNode({
      id: id,
      x: worldCoordinates.x,
      y: worldCoordinates.y,
      width: 175,
      height: 50,
      label: name,
      color: "#444",
      fontColor: "white",
      serviceDefinition: {
        image: image ?? "",
        ports: ports,
        environment: {},
        volumes: [],
        networks: [],
        command: "",
      }
    });

    canvas.addElement(node);
    setVisibility(false);
    clearForm();
  };

  const render = () => (
    <div
      className={`absolute w-full h-full rounded-md ${
        isVisible ? "" : "hidden"
      }`}
    >
      <div
        id="add-node-form"
        className={`absolute p-5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10`}
      >
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="block text-gray-700 text-sm font-bold mb-2">
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
              required
              placeholder="Service name"
              value={name}
            />
          </div>
          <div className="block text-gray-700 text-sm font-bold mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="node-image"
            >
              Image
            </label>
            <input
              onChange={(e) => setImage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="node-image"
              type="text"
              required
              placeholder="Docker image"
              value={image}
            />
          </div>

          <div className="block text-gray-700 text-sm font-bold mb-2">
            <div className="flex flex-col gap-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="node-ports"
              >
                Exposed Ports
              </label>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPortInputs([...portInputs, 0]);
                }}
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-3 max-w-[75px] rounded focus:outline-none focus:shadow-outline flex items-center gap-1"
              >
                Add
                <PlusCircle />
              </button>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {portInputs.map((port, index) => (
                <div className="flex gap-1" key={`port-input-${index}`}>
                  <input
                    key={index}
                    onChange={(e) => {
                      const newPorts = [...ports];
                      newPorts[index] = parseInt(e.target.value);
                      setPorts(newPorts);
                    }}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="node-ports"
                    type="number"
                    required
                    placeholder="Port"
                    value={ports[index] ?? ""}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const newPortInputs = [...portInputs];
                      newPortInputs.splice(index, 1);
                      setPortInputs(newPortInputs);

                      const newPorts = [...ports];
                      newPorts.splice(index, 1);
                      setPorts(newPorts);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
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
