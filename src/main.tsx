import { useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar/Sidebar";
import { AppProvider } from "./store/app-provider";
import { Store } from "./store/types";
import { CurrentProject } from "./components/CurrentProject";

export const Main = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initialState, setInitialState] = useState<Store>({
    app: null,
    projects: [],
  });

  const loadInitialState = async () => {
    const projects = await api.loadProjects();
    setInitialState({ ...initialState, projects });
    setLoading(false);
  };

  useEffect(() => {
    loadInitialState();
  }, []);

  if (loading) {
    // Centered loading spinner
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.009 8.009 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <AppProvider initialState={{ ...initialState }}>
      <div className="lg:flex m-2 gap-2">
        <Sidebar />
        <CurrentProject />
      </div>
    </AppProvider>
  );
};

export default Main;
