import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaBook, FaUser, FaCheckCircle, FaTimesCircle, FaHandHoldingHeart, FaSearch, FaFilter, FaEdit } from 'react-icons/fa';
import EditBookModal from "./EditBookModal";

export default function AdminBookIssue() {
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [issuing, setIssuing] = useState(null);
  const [editingBook, setEditingBook] = useState(null); // Add state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6; // you can change to 9 / 12
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const deleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/admin/${bookId}`);
      alert("Book deleted");

      // Remove from UI
      setBooks(books.filter(b => b.id !== bookId));
    } catch (err) {
      alert(err.response?.data || "Error deleting book");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre]);

  useEffect(() => {
    setLoading(true);
    api.get("/admin/books")
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const borrowBook = async (bookId) => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    setIssuing(bookId);

    try {
      await api.post("/admin/borrow", {
        username,
        bookId
      });
      alert("Book issued successfully!");

      // Refresh list
      setBooks(books.map(b =>
        b.id === bookId ? { ...b, available: false } : b
      ));
      setUsername("");
    } catch (err) {
      alert(err.response?.data || "Error issuing book");
    } finally {
      setIssuing(null);
    }
  };

  // Get unique genres from books
  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))].sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = filteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const availableCount = books.filter(b => b.available).length;
  const borrowedCount = books.filter(b => !b.available).length;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading books...</p>
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
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <h2 className="text-5xl font-bold text-indigo-900">
              Issue Book
            </h2>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            Issue books to users from the library collection
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Books</p>
                <p className="text-3xl font-bold text-indigo-700">{books.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaBook className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Available</p>
                <p className="text-3xl font-bold text-green-700">{availableCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Borrowed</p>
                <p className="text-3xl font-bold text-red-700">{borrowedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Username Input Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-900">
              Enter Username to Issue Book
            </h3>
          </div>

          <div className="relative max-w-md">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-lg" />
            <input
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl py-4 pl-12 pr-4 text-lg text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            {username && (
              <button
                onClick={() => setUsername('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors text-xl font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Bar with Genre Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="text"
                placeholder="Search by book title or author..."
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

            {/* Genre Dropdown */}
            <div className="relative w-full md:w-64">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg py-3 pl-12 pr-10 text-gray-700 overflow-hidden focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
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
              Showing <span className="font-bold text-indigo-700">{filteredBooks.length}</span> of <span className="font-bold">{books.length}</span> books
              {selectedGenre && (
                <span className="ml-2 text-indigo-600">
                  • Genre: <span className="font-semibold">{selectedGenre}</span>
                </span>
              )}
            </div>

            {(searchTerm || selectedGenre) && (
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

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBooks.map((book, index) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Card Content */}
                <div className="p-6">
                  {/* Book Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${book.available ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-red-100'
                    }`}>
                    <FaBook className={`text-2xl ${book.available ? 'text-green-600' : 'text-red-600'
                      }`} />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {book.title}
                  </h4>

                  {/* Author */}
                  <p className="text-gray-500 mb-4 flex items-center gap-2">
                    <span className="text-xs text-indigo-500">✦</span>
                    <span className="font-medium text-sm">{book.author}</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                    <span className="font-semibold text-indigo-500">📍</span>
                    <span>{book.bookPlace}</span>
                  </p>

                  {/* Genre Badge */}
                  {book.genre && (
                    <div className="mb-4">
                      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                        {book.genre}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="mb-4 pt-4 border-t border-gray-100">
                    {book.available ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="text-lg" />
                        <span className="font-semibold text-sm">Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <FaTimesCircle className="text-lg" />
                        <span className="font-semibold text-sm">Borrowed</span>
                      </div>
                    )}
                  </div>

                  {/* Issue Button */}
                  {book.available && (
                    <button
                      onClick={() => borrowBook(book.id)}
                      disabled={!username || issuing === book.id}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${!username
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : issuing === book.id
                          ? 'bg-indigo-400 text-white cursor-wait shadow-md'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                        }`}
                    >
                      {issuing === book.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Issuing...
                        </span>
                      ) : (
                        'Issue Book'
                      )}
                    </button>
                  )}
                  {book.available && isAdmin && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {!book.available && (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedGenre ? 'Try adjusting your filters' : 'No books available'}
            </p>
          </div>
        )}
      </div>

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

      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onUpdate={(updatedBook) => {
            setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
          }}
        />
      )}
    </div>
  );
}