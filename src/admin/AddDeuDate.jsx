import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaBook, FaUser, FaClock, FaCheckCircle, FaCalendarPlus, FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';

export default function AddDueDate() {
  const [borrows, setBorrows] = useState([]);
  const [extendDays, setExtendDays] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [extending, setExtending] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const borrowsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/borrows")
      .then(res => {
        setBorrows(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const extendDueDate = async (borrowId) => {
    const days = extendDays[borrowId];
    if (!days || days <= 0) {
      alert("Please enter valid number of days");
      return;
    }

    setExtending(borrowId);

    try {
      await api.post("/admin/extend-due-date", {
        borrowId,
        extraDays: days
      });

      alert("Due date extended successfully!");

      // Update UI
      setBorrows(borrows.map(b =>
        b.id === borrowId
          ? {
              ...b,
              dueDate: new Date(
                new Date(b.dueDate).getTime() + days * 86400000
              ).toISOString().split("T")[0]
            }
          : b
      ));

      setExtendDays({ ...extendDays, [borrowId]: "" });
    } catch (err) {
      alert(err.response?.data || "Error extending due date");
    } finally {
      setExtending(null);
    }
  };

  // Calculate days until due or overdue
  const getDaysStatus = (dueDate, returnDate) => {
    if (returnDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Filter borrows
  const filteredBorrows = borrows.filter(borrow => {
    const matchesSearch = 
      borrow.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "borrowed" && !borrow.returnDate) ||
      (statusFilter === "returned" && borrow.returnDate) ||
      (statusFilter === "overdue" && !borrow.returnDate && getDaysStatus(borrow.dueDate, borrow.returnDate) < 0);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastBorrow = currentPage * borrowsPerPage;
  const indexOfFirstBorrow = indexOfLastBorrow - borrowsPerPage;
  const currentBorrows = filteredBorrows.slice(indexOfFirstBorrow, indexOfLastBorrow);
  const totalPages = Math.ceil(filteredBorrows.length / borrowsPerPage);

  // Stats
  const totalBorrowed = borrows.filter(b => !b.returnDate).length;
  const totalReturned = borrows.filter(b => b.returnDate).length;
  const totalOverdue = borrows.filter(b => 
    !b.returnDate && getDaysStatus(b.dueDate, b.returnDate) < 0
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading borrowed books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <FaCalendarPlus className="text-white text-xl" />
            </div>
            <h2 className="text-5xl font-bold text-indigo-900">
              Manage Due Dates
            </h2>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            Extend due dates for borrowed books
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Records</p>
                <p className="text-3xl font-bold text-indigo-700">{borrows.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaBook className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Currently Borrowed</p>
                <p className="text-3xl font-bold text-blue-700">{totalBorrowed}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaClock className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Returned</p>
                <p className="text-3xl font-bold text-green-700">{totalReturned}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Overdue</p>
                <p className="text-3xl font-bold text-red-700">{totalOverdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                placeholder="Search by book title or username..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg py-3 pl-12 pr-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors text-lg font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg py-3 pl-12 pr-10 text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="borrowed">Currently Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Info and Clear Button */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-indigo-700">{filteredBorrows.length}</span> of <span className="font-bold">{borrows.length}</span> records
              {statusFilter !== "all" && (
                <span className="ml-2 text-indigo-600">
                  • Status: <span className="font-semibold capitalize">{statusFilter}</span>
                </span>
              )}
            </div>
            
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 hover:underline transition-colors"
              >
                <span>Clear Filters</span>
                <span className="text-lg">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Borrowed Books Grid */}
        {filteredBorrows.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBorrows.map((borrow, index) => {
              const daysStatus = getDaysStatus(borrow.dueDate, borrow.returnDate);
              const isOverdue = daysStatus !== null && daysStatus < 0;
              const isDueSoon = daysStatus !== null && daysStatus >= 0 && daysStatus <= 3;

              return (
                <div
                  key={borrow.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-4">
                      {borrow.returnDate ? (
                        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                          <FaCheckCircle />
                          Returned
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                          <FaCalendarAlt />
                          Overdue ({Math.abs(daysStatus)} days)
                        </span>
                      ) : isDueSoon ? (
                        <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-yellow-200">
                          <FaClock />
                          Due Soon ({daysStatus} days)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
                          <FaClock />
                          Active
                        </span>
                      )}
                    </div>

                    {/* Book Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBook className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                          {borrow.book.title}
                        </h4>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUser className="text-indigo-500" />
                        <span className="text-sm font-medium">{borrow.user.username}</span>
                      </div>
                    </div>

                    {/* Due Date Info */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Due Date:</span>
                        <span className={`font-semibold ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-800'}`}>
                          {borrow.dueDate}
                        </span>
                      </div>
                      {borrow.returnDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Return Date:</span>
                          <span className="font-semibold text-green-600">{borrow.returnDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Extend Due Date Section */}
                    {!borrow.returnDate && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Extend Due Date
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            placeholder="Days"
                            value={extendDays[borrow.id] || ""}
                            onChange={e =>
                              setExtendDays({
                                ...extendDays,
                                [borrow.id]: e.target.value
                              })
                            }
                            className="flex-1 bg-indigo-50 border-2 border-indigo-200 rounded-lg py-2 px-3 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                          />
                          <button
                            onClick={() => extendDueDate(borrow.id)}
                            disabled={!extendDays[borrow.id] || extending === borrow.id}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              !extendDays[borrow.id]
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : extending === borrow.id
                                ? 'bg-indigo-400 text-white cursor-wait'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            {extending === borrow.id ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              'Extend'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No records found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" ? 'Try adjusting your filters' : 'No borrowed books yet'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold ${
                  currentPage === i + 1
                    ? "bg-indigo-700 text-white"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}