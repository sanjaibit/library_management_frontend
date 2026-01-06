import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminBookIssue from "../admin/AdminBookIssue";
import BorrowList from "../admin/BorrowList";
import DotGrid from "../layouts/DotGrid";
import { FaBook, FaListAlt, FaTachometerAlt, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import AddDueDate from "../admin/AddDeuDate";
import { FaArrowRotateRight, FaCirclePlus } from "react-icons/fa6";
import AdminAddBook from "../admin/AdminAddBook";

export default function LibraryStaffDashboard() {
    const [activeTab, setActiveTab] = useState("issue");
    const navigate = useNavigate();

    const tabs = [
        { id: "issue", label: "Issue Books", icon: FaBook },
        { id: "borrows", label: "Borrowed Books", icon: FaListAlt },
        { id: "addDueDate", label: "Extend DueDate", icon: FaArrowRotateRight },
        { id: "addbook", label: "Add Book", icon: FaCirclePlus }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen relative overflow-hidden ">

            <DotGrid
                dotSize={5}
                gap={50}
                baseColor="#B6AE9F"
                activeColor="#6F00FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            />
            <div className="bg-white relative shadow-lg border-b-4 border-indigo-600 z-10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FaTachometerAlt className="text-white text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-indigo-900">
                                    Library Staff Panel
                                </h2>
                                <p className="text-gray-600 text-lg mt-1">
                                    Manage books & borrows
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                            <FaSignOutAlt className="text-lg" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold">
                        <FaUserShield />
                        <span>Library Staff Access</span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-2 -mb-px">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all rounded-t-xl ${activeTab === tab.id
                                            ? "bg-indigo-600 text-white shadow-lg"
                                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                        }`}
                                >
                                    <Icon className="text-lg" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto relative z-15">
                {/* Tab Content */}
                <div className="transition-all duration-300">
                    {activeTab === "issue" && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <AdminBookIssue />
                        </div>
                    )}
                    {activeTab === "borrows" && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <BorrowList />
                        </div>
                    )}
                    {activeTab === "addDueDate" && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <AddDueDate />
                        </div>
                    )}
                    {activeTab === "addbook" && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <AdminAddBook />
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
