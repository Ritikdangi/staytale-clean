import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/user/create-admin`, formData, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        alert("Admin created successfully");
        setFormData({ username: "", email: "", password: "", address: "", phone: "" });
      } else {
        alert(res?.data?.message || "Unable to create admin");
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="p-4 w-full max-w-xl">
      <h3 className="text-xl font-semibold mb-4">Create New Admin</h3>
      <p className="text-sm text-gray-600 mb-4">Fill details to create a new admin account. Only existing admins can perform this action.</p>
      <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded shadow">
        <input name="create-admin-username" autoComplete="off" id="username" placeholder="Username" value={formData.username} onChange={handleChange} className="p-3 border rounded" />
        <input name="create-admin-email" autoComplete="off" id="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 border rounded" />
        <input name="new-password" autoComplete="new-password" id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-3 border rounded" />
        <textarea name="create-admin-address" autoComplete="off" id="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-3 border rounded resize-none" />
        <input name="create-admin-phone" autoComplete="off" id="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-3 border rounded" />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Create Admin
          </button>
          <button
            type="button"
            className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition"
            onClick={() => setFormData({ username: "", email: "", password: "", address: "", phone: "" })}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
