import { CanvasElement } from "../canvas/types";
import { BaseElement } from "../canvas/base-element";
import { Text } from "../canvas/text";

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: Array<Text | BaseElement | CanvasElement>;
};

export type App = {
  currentProject: Project | null;
};

export type Store = {
  app: App;
  projects: Project[];
};

export enum Types {
  Create = "CREATE_PROJECT",
  Update = "UPDATE_PROJECT",
  Delete = "DELETE_PROJECT",
  SetCurrentProject = "SET_CURRENT_PROJECT",
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
