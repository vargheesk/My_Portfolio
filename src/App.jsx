import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Alive from "./pages/Alive";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/alive" element={<Alive />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
