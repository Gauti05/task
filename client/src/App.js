
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./pages/Profile";
import DashboardHome from "./pages/DashboardHome";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} /> 
  
  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
    <Route index element={<DashboardHome />} />


    <Route path="tasks" element={<Tasks />} />
      <Route path="profile" element={<Profile />} />
  </Route>
</Routes>

    </Router>
  );
}

export default App;
