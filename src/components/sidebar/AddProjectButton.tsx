import { useContext } from "react";
import { AppContext } from "../../store/app-provider";
import { Types } from "../../store/reducers/projects/actions";

export const AddProjectButton = () => {
  const { state, dispatch } = useContext(AppContext);

  const onClick = () => {
    const project = {
      id: state.projects.length + 1,
      name: `Project ${state.projects.length + 1}`,
    };
    dispatch({ type: Types.Create, payload: project });
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
