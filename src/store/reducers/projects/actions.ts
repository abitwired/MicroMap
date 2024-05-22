import { ActionMap, Project, Types } from "../../types";

export type ProjectPayload = {
  [Types.Create]: Project;
  [Types.Update]: Project;
  [Types.Delete]: {
    id: string;
  };
};

export type ProjectActions =
  ActionMap<ProjectPayload>[keyof ActionMap<ProjectPayload>];
