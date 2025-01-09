import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-medium">
                Welcome to react-hook-form tutorial
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;