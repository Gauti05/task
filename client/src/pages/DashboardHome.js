
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function DashboardHome() {
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/tasks");
        const tasks = res.data.tasks;
        setStats({
          total: tasks.length,
          completed: tasks.filter(t => t.completed).length,
        });
      } catch {
        alert("Failed to fetch dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow flex items-center space-x-4">
          <div className="bg-indigo-600 text-white p-3 rounded-full">
         
            <span className="text-2xl" role="img" aria-label="tasks">📝</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Total Tasks</h2>
            <p className="text-2xl">{stats.total}</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow flex items-center space-x-4">
          <div className="bg-green-600 text-white p-3 rounded-full">
            <span className="text-2xl" role="img" aria-label="completed">✅</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Completed Tasks</h2>
            <p className="text-2xl">{stats.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
