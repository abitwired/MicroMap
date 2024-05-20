import { ActionMap, Project } from "../../types";

export enum Types {
  Create = "CREATE_PROJECT",
  Delete = "DELETE_PROJECT",
  Update = "UPDATE_PROJECT",
}

export type ProjectPayload = {
  [Types.Create]: Project;
  [Types.Update]: Project;
  [Types.Delete]: {
    id: string;
  };
};

export type ProjectActions =
  ActionMap<ProjectPayload>[keyof ActionMap<ProjectPayload>];
