import { Project, Types } from "../../types";
import { ProjectActions } from "./actions";

/**
 * Reducer function for the projects state.
 * @param state - The current state of the projects.
 * @param action - The action object that contains the type and payload.
 * @returns The updated state after applying the action.
 */
export const projectReducer = (state: Project[], action: ProjectActions) => {
  switch (action.type) {
    case Types.Create:
      return [...state, action.payload];
    case Types.Update:
      return [
        ...state.map((project: Project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      ];
    case Types.Delete:
      return [
        ...state.filter((project: Project) => project.id !== action.payload.id),
      ];
    default:
      return state;
  }
};
