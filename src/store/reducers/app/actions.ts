import { ActionMap, Project } from "../../types";

export enum Types {
  SetCurrentProject = "SET_CURRENT_PROJECT",
}

export type AppPayload = {
  [Types.SetCurrentProject]: {
    project: Project;
  };
};

export type AppActions = ActionMap<AppPayload>[keyof ActionMap<AppPayload>];
