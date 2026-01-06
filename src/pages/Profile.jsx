import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaUser, FaEnvelope, FaIdCard, FaBook, FaExclamationTriangle, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/profile")
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-red-500 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Unable to load profile</h3>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center shadow-md">
              <FaUser className="text-white text-xl" />
            </div>
            <h2 className="text-5xl font-bold text-indigo-900">
              User Profile
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your library account
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-all duration-300 border border-gray-100">
          <div className="p-8">
            {/* Profile Avatar */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <FaUser className="text-white text-4xl" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.userDetails.fullName}
                </h3>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                      <FaEnvelope className="text-indigo-600" />
                    </div>
                    <span className="font-medium">{profile.userDetails.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                      <FaIdCard className="text-amber-600" />
                    </div>
                    <span className="font-medium">Card: {profile.userDetails.libraryCardNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Currently Borrowed - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center shadow-md">
                <FaBook className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-900">
                Currently Borrowed
              </h3>
            </div>

            {profile.booksBorrowed.currentlyBorrowed.length > 0 ? (
              <div className="space-y-4">
                {profile.booksBorrowed.currentlyBorrowed.map((b, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-1 border border-indigo-100">
                            <FaBook className="text-indigo-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                              {b.title}
                            </h4>
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaCalendarAlt className="text-indigo-500" />
                              <span className="text-sm">
                                Due: <span className="font-semibold">{new Date(b.dueDate).toLocaleDateString()}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Due Status Badge */}
                      {new Date(b.dueDate) > new Date() ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap border border-green-100">
                          <FaCheckCircle />
                          On Time
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap border border-red-100">
                          <FaExclamationTriangle />
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBook className="text-indigo-400 text-2xl" />
                </div>
                <p className="text-gray-600">No books currently borrowed</p>
              </div>
            )}
          </div>

          {/* Outstanding Fine - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <FaExclamationTriangle className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-900">
                Outstanding Fine
              </h3>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                {profile.fines.outstandingAmount > 0 ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                      <FaExclamationTriangle className="text-red-600 text-3xl" />
                    </div>
                    <p className="text-6xl font-bold text-red-600 mb-2">
                      ₹{profile.fines.outstandingAmount}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Please clear your dues at the earliest
                    </p>
                    <button className="mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg">
                      Pay Now
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                      <FaCheckCircle className="text-green-600 text-3xl" />
                    </div>
                    <p className="text-6xl font-bold text-green-600 mb-2">
                      ₹0
                    </p>
                    <p className="text-gray-600 text-sm">
                      No outstanding fines
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h4 className="text-lg font-bold text-indigo-900 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Books Borrowed</span>
                  <span className="font-bold text-indigo-700">
                    {profile.booksBorrowed.currentlyBorrowed.length}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Fines</span>
                  <span className={`font-bold ${profile.fines.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{profile.fines.outstandingAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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