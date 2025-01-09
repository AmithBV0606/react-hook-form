import { BrowserRouter, Route, Routes } from "react-router";
import SimpleForm from "./components/1-simple-form";
import ReactHookForm from "./components/2-react-hook-form";
import ReactHookFormWithZod from "./components/3-react-hook-form-zod";

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
        <Route path="/simple-form" element={<SimpleForm />} />
        <Route path="/react-hook-form" element={<ReactHookForm />} />
        <Route path="/react-hook-form-zod" element={<ReactHookFormWithZod />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;