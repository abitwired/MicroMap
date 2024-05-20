import { ActionMap } from "../../types";

export enum Types {
  Create = "CREATE_PROJECT",
  Delete = "DELETE_PROJECT",
}

export type ProjectPayload = {
  [Types.Create]: {
    id: string;
    name: string;
  };
  [Types.Delete]: {
    id: string;
  };
};

export type ProjectActions =
  ActionMap<ProjectPayload>[keyof ActionMap<ProjectPayload>];
