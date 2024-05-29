import { Graph } from "./graph";

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  graph: Graph;
};

export type ServiceDefinition = {
  image: string;
  ports: number[];
  environment: Record<string, string>;
  volumes: string[];
  networks: string[];
  command: string;
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
