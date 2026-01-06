import { useState } from "react";
import api from "../api/axios";
import { FaEnvelope, FaLock, FaUser, FaUserShield } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

export default function Signup() {

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "USER",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/auth/register", form);
        alert("Signup successful! Please login.");
    };

    const Navtologin = () =>
    {
        navigate("/login");
    }

    return (

        <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">Sign up</h1>
            <p className="text-center text-gray-500 text-sm mb-8">
                Hey, enter your details to create your account
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-md">
                <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="relative">
                    <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <select
                        name="role"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    >
                        <option value="USER">User</option>
                        <option value="STAFF">STAFF</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
                <button className="bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-2 shadow-md cursor-pointer">
                    Sign Up
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6 cursor-pointer">
                Already have an account? <a onClick={Navtologin} className="text-indigo-600 font-semibold hover:underline">Login Now</a>
            </p>
        </div>

    );
}
