import React, { createContext, useReducer } from "react";
import { Store } from "./types";
import { ProjectActions } from "./reducers/projects/actions";
import { projectReducer } from "./reducers/projects/reducer";
import { appReducer } from "./reducers/app/reducer";
import { AppActions } from "./reducers/app/actions";

const DEFAULT_STATE: Store = {
  app: null,
  projects: [],
};

const AppContext = createContext<{
  state: Store;
  dispatch: React.Dispatch<ProjectActions | AppActions>;
}>({
  state: DEFAULT_STATE,
  dispatch: () => null,
});

const mainReducer = (
  { app, projects }: Store,
  action: ProjectActions | AppActions
) => ({
  app: appReducer(app, action as AppActions),
  projects: projectReducer(projects, action as ProjectActions),
});

const AppProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Store;
}) => {
  const [state, dispatch] = useReducer(
    mainReducer,
    initialState ?? DEFAULT_STATE
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
