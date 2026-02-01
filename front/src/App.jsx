import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Comp/Dashboard";
import Add from "./Comp/Add";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
