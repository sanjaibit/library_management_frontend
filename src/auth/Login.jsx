import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

export default function Login() {

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const res = await api.post("/auth/login", form);

            login(res.data); // store user + token
            console.log(res.data);
            if (res.data.roles?.includes("ROLE_ADMIN")) {
                navigate("/admin");
            }
            else if (res.data.roles?.includes("ROLE_STAFF")) {
                navigate("/staff");
            }
            else if (res.data.roles?.includes("ROLE_LIB_STAFF")) {
                navigate("/library-staff");
            }
            else {
                navigate("/");
            }
        } catch (err) {
            if (err.response?.status === 403) {
                setError("Invalid username or password");
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    const NavigateToSignup = () => {
        navigate("/signup");
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col bg-white-500">
            <h1 className="text-4xl font-sans font-bold text-center text-indigo-600 ">
                Login
            </h1>
            <p className=" text-center font-bold text-sm mt-4 mb-12">
                Hey, enter your details to login to your account
            </p>
            <form onSubmit={handleSubmit} className=" flex flex-col gap-5 w-md">
                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <div className="relative">
                    <FaUser className=" absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input name="username" placeholder="Username"
                        onChange={handleChange}
                        className=" w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <div className="relative">
                    <FaLock className=" absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input name="password" type="password"
                        placeholder="Password" onChange={handleChange}
                        className=" w-full border border-gray-300 rounded-lg p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                </div>
                <button className=" bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors cursor-pointer ">Login</button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? <a onClick={NavigateToSignup} className="text-indigo-600 cursor-pointer font-semibold hover:underline">Sign up Now</a>
            </p>
        </div>
    );
}