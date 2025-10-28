
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h2>
         <nav className="space-y-4">
  <Link
    to="/dashboard"
    className="block px-3 py-2 rounded hover:bg-blue-100 font-semibold text-gray-700"
  >
    Dashboard Home
  </Link>
  <Link
    to="/dashboard/tasks"
    className="block px-3 py-2 rounded hover:bg-blue-100 font-semibold text-gray-700"
  >
    Tasks
  </Link>
  <Link to="/dashboard/profile" className="block px-3 py-2 rounded hover:bg-blue-100 font-semibold text-gray-700">
  Profile
</Link>

</nav>

        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
