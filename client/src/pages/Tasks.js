import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axios";

const schema = yup.object().shape({
  title: yup.string().required("Task title is required"),
});

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

 
  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    });
    return {
      fileName: res.data.filename,
      fileOriginalName: res.data.originalname,
      filePath: res.data.path,
    };
  };

  const onSubmit = async (data) => {
    try {
      let fileInfo = null;
      if (selectedFile) {
        fileInfo = await uploadFile(selectedFile);
      }

      const taskData = {
        title: data.title,
        ...fileInfo,
      };

      if (editTaskId) {
        await api.put(`/tasks/${editTaskId}`, taskData);
        setEditTaskId(null);
      } else {
        await api.post("/tasks", taskData);
      }
      setSelectedFile(null);
      reset();
      setUploadProgress(0);
      fetchTasks();
    } catch {
      alert("Failed to save task");
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; 

      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPEG images and PDF files are allowed");
        e.target.value = null;
        return;
      }

      if (file.size > maxSize) {
        alert("File size exceeds 5MB");
        e.target.value = null;
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    reset({ title: task.title });
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch {
        alert("Failed to delete task");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Your Tasks</h2>

     
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-3 mb-8"
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Enter task title"
          {...register("title")}
          disabled={isSubmitting}
          className={`flex-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="border rounded-md p-2"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary sm:w-40 disabled:opacity-50"
        >
          {editTaskId ? (isSubmitting ? "Updating..." : "Update Task") : (isSubmitting ? "Adding..." : "Add Task")}
        </button>
      </form>

      {isSubmitting && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-md h-2 mb-4">
          <div
            className="bg-indigo-600 h-2 rounded-md"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {selectedFile && (
        <div className="mb-4 flex items-center space-x-4">
          <span className="text-gray-700">Selected file: {selectedFile.name}</span>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-red-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      <p className="text-red-500 mb-6">{errors.title?.message}</p>

     
      <ul className="divide-y divide-gray-200">
        {tasks.length === 0 && (
          <li className="text-center py-6 text-gray-500">No tasks yet</li>
        )}
        {tasks.map((task) => (
          <li key={task._id} className="py-3 flex justify-between items-center space-x-4">
            <div>
              <span className="text-gray-700">{task.title}</span>
              {task.fileOriginalName && (
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/uploads/${encodeURIComponent(task.fileName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline mt-1"
                >
                  {task.fileOriginalName}
                </a>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEdit(task)}
                className="text-indigo-600 hover:underline"
                aria-label="Edit task"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-600 hover:underline"
                aria-label="Delete task"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
