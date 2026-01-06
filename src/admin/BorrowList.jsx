import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaBook, FaUser, FaCalendarAlt, FaSearch, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

export default function BorrowList() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, overdue
  const [currentPage, setCurrentPage] = useState(1);
  const borrowsPerPage = 6; // Change to 9 or 12 if you want

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/borrows")
      .then(res => {
        setBorrows(res.data);
        console.log(res.data)
        setLoading(false);
      })
      .catch(err => {
        console.error(err);

        setLoading(false);
      });
  }, []);

  const returnBook = async (borrowId) => {
    try {
      await api.post(`/borrow/return/${borrowId}`);

      // Update UI instantly
      setBorrows(borrows.map(b =>
        b.id === borrowId
          ? { ...b, returnDate: new Date().toISOString().split("T")[0] }
          : b
      ));

      alert("Book returned successfully");
    } catch (err) {
      alert(err.response?.data || "Return failed");
    }
  };

  const getStatus = (dueDate, returnBook) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (returnBook || false)
      return { label: "Returned", color: "green", icon: FaCheckCircle }
    if (diffDays < 0) return { label: "Overdue", color: "red", icon: FaExclamationTriangle };
    if (diffDays <= 3) return { label: "Due Soon", color: "amber", icon: FaClock };
    return { label: "Active", color: "green", icon: FaCheckCircle };
  };

  const filteredBorrows = borrows.filter(b => {
    const matchesSearch =
      b.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user.username.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    const status = getStatus(b.dueDate, b.returnDate);
    if (filterStatus === "overdue") return matchesSearch && status.label === "Overdue";
    if (filterStatus === "active") return matchesSearch && status.label !== "Overdue" && status.label !== "Returned";
    if (filterStatus === "Returned") return matchesSearch && status.label !== "Overdue" && status.label === "Returned";
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastBorrow = currentPage * borrowsPerPage;
  const indexOfFirstBorrow = indexOfLastBorrow - borrowsPerPage;
  const currentBorrows = filteredBorrows.slice(indexOfFirstBorrow, indexOfLastBorrow);
  const totalPages = Math.ceil(filteredBorrows.length / borrowsPerPage);

  const stats = {
    total: borrows.length,
    returnBook: borrows.filter(b => getStatus(b.dueDate, b.returnDate).label === "Returned").length,
    overdue: borrows.filter(b => getStatus(b.dueDate, b.returnDate).label === "Overdue").length,
    dueSoon: borrows.filter(b => getStatus(b.dueDate, b.returnDate).label === "Due Soon").length,
    active: borrows.filter(b => getStatus(b.dueDate, b.returnDate).label === "Active").length
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
              <FaBook className="text-white text-xl" />
            </div>
            <h3 className="text-5xl font-bold text-indigo-900">
              All Borrowed Books
            </h3>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            Track and manage all book borrowings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaBook className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Overdue</p>
                <p className="text-3xl font-bold text-red-700">{stats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Due Soon</p>
                <p className="text-3xl font-bold text-amber-600">{stats.dueSoon}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <FaClock className="text-amber-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active</p>
                <p className="text-3xl font-bold text-green-700">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
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

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === "all"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === "active"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus("Returned")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === "Returned"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
              >
                Returned
              </button>
              <button
                onClick={() => setFilterStatus("overdue")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === "overdue"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
              >
                Overdue
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-bold text-indigo-700">{filteredBorrows.length}</span> of <span className="font-bold">{borrows.length}</span> borrowed books
          </div>
        </div>

        {/* Borrows Grid */}
        {filteredBorrows.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBorrows.map((b, index) => {
                const status = getStatus(b.dueDate, b.returnDate);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="p-6">
                      {/* Book Icon with Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${status.color === 'red' ? 'bg-linear-to-br from-red-50 to-red-100' :
                            status.color === 'amber' ? 'bg-linear-to-br from-amber-50 to-amber-100' :
                              'bg-linear-to-br from-green-50 to-green-100'
                          }`}>
                          <FaBook className={`text-xl ${status.color === 'red' ? 'text-red-600' :
                              status.color === 'amber' ? 'text-amber-600' :
                                'text-green-600'
                            }`} />
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs ${status.color === 'red' ? 'bg-red-50 text-red-700 border border-red-100' :
                            status.color === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                          <StatusIcon className="text-sm" />
                          {status.label}
                        </span>
                      </div>

                      {/* Book Title */}
                      <h4 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2 leading-tight">
                        {b.book.title}
                      </h4>
                      <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                        <span className="font-semibold text-indigo-500">📍</span>
                        <span>{b.book.bookPlace}</span>
                      </p>

                      {/* User Info */}
                      <div className="flex items-center gap-2 mb-3 text-gray-600">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <FaUser className="text-indigo-600 text-sm" />
                        </div>
                        <span className="text-sm font-medium">{b.user.username}</span>
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <FaCalendarAlt className="text-indigo-600 text-sm" />
                        </div>
                        <span className="text-sm">
                          Due: <span className="font-semibold">{new Date(b.dueDate).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {/* Return Button */}
                      {status.label !== "Returned" && (
                        <button
                          onClick={() => returnBook(b.id)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          Return Book
                        </button>
                      )}

                      {status.label === "Returned" && (
                        <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl font-semibold text-center">
                          Book Returned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {/* Previous */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 1
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
                    className={`w-10 h-10 rounded-lg font-bold ${currentPage === i + 1
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
                  className={`px-4 py-2 rounded-lg font-semibold ${currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No borrowed books found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms or filters' : 'No books have been borrowed yet'}
            </p>
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