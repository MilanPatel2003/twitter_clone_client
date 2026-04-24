import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Sidebar } from "./components/common/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
