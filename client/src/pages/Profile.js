
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/profile", { name, email });
      login(res.data.user, localStorage.getItem("token")); 
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
          <small className="text-gray-500">Email cannot be changed</small>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
