import { MouseEventHandler } from "react";

/**
 * Props for the MenuAction component.
 */
export type MenuActionProps = {
  /**
   * The name of the menu action.
   */
  name: string;

  /**
   * The click event handler for the menu action.
   */
  onClick: MouseEventHandler<HTMLLIElement>;
};

/**
 * Represents a menu action in the context menu.
 */
export interface IMenuAction extends JSX.Element {}

/**
 * Represents a menu action component.
 *
 * @param {MenuActionProps} props - The props for the menu action.
 * @returns {IMenuAction} The menu action component.
 */
export const MenuAction = ({ name, onClick }: MenuActionProps): IMenuAction => {
  const render = () => (
    <li
      className="cursor-pointer hover:bg-gray-700 p-2 rounded-md text-sm text-white
      transition-colors duration-100 ease-in-out"
      onClick={onClick}
    >
      {name}
    </li>
  );

  return {
    ...render(),
  };
};

export default MenuAction;
