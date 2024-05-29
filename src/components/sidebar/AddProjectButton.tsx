import { useContext } from "react";
import { AppContext } from "../../store/app-provider";
import { Types } from "../../store/types";

const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

export const AddProjectButton = () => {
  const { state, dispatch } = useContext(AppContext);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch({
      type: Types.Create,
      payload: {
        id: uuidv4(),
        name: `Untitled Project`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <button
      className="ml-auto hover:bg-emerald-700 p-1 rounded-md transition-colors duration-100 ease-in-out
    "
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
    </button>
  );
};

export default AddProjectButton;
