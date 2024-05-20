import React, { createContext, useReducer } from "react";
import { Store } from "./types";
import { ProjectActions } from "./reducers/projects/actions";
import { projectReducer } from "./reducers/projects/reducer";

const DEFAULT_STATE: Store = {
  projects: [],
};

const AppContext = createContext<{
  state: Store;
  dispatch: React.Dispatch<any>;
}>({
  state: DEFAULT_STATE,
  dispatch: () => null,
});

const mainReducer = ({ projects }: Store, action: ProjectActions) => ({
  projects: projectReducer(projects, action),
  // shoppingCart: shoppingCartReducer(shoppingCart, action),
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
