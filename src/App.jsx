import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import { Init, Play, View, Home } from "./pages";
import { TeamsContext, useTeamsProvider } from "src/hooks/teams";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/init",
    element: <Init />,
  },
  {
    path: "/play",
    element: <Play />,
  },
  {
    path: "/view",
    element: <View />,
  },
]);

function App() {
  const teamsTuple = useTeamsProvider();
  return (
    <TeamsContext.Provider value={teamsTuple}>
      <RouterProvider router={router} />
    </TeamsContext.Provider>
  );
}

export default App;
