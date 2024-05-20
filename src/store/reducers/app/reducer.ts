import { App } from "../../types";
import { AppActions, Types } from "./actions";

/**
 * Reducer function for the app state.
 * @param state - The current state of the app.
 * @param action - The action object that contains the type and payload.
 * @returns The updated state after applying the action.
 */
export const appReducer = (state: App, action: AppActions) => {
  switch (action.type) {
    case Types.SetCurrentProject:
      return {
        ...state,
        currentProject: action.payload.project,
      };
    default:
      return state;
  }
};
