import { MouseEventHandler } from "react";

export type MenuActionProps = {
  name: string;
  onClick: MouseEventHandler<HTMLLIElement>;
};

export interface IMenuAction extends JSX.Element {}

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
