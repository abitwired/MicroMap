import { useState } from "react";

export interface ILoadingIcon extends JSX.Element {
  setVisibility(isVisible: boolean): void;
}

/**
 * Represents a loading icon component.
 *
 * @returns An object containing the `setVisibility` function and the rendered loading icon component.
 */
export const LoadingIcon = (): ILoadingIcon => {
  const [isVisible, setIsVisible] = useState(false);

  const setVisibility = (isVisible: boolean) => {
    setIsVisible(isVisible);
  };

  const render = () => (
    <div
      className={`absolute top-7 right-14 flex items-center ${
        isVisible ? "" : "hidden"
      }`}
    >
      <svg
        className="animate-spin -ml-1 mr-3 h-7 w-7 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-white text-sm text-gray-300">Saving...</p>
    </div>
  );

  return {
    setVisibility,
    ...render(),
  };
};

export default LoadingIcon;
