import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-600">Register to get started</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your full name"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Create a password"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your password"
            />
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword?.message}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
