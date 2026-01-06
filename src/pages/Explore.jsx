import { useEffect, useState, useMemo } from "react";
import api from '../api/axios';
import { FaSearch, FaBook, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';

export default function Explore() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedGenre, selectedAvailability]);

  useEffect(() => {
    setLoading(true);
    api.get(`/books?search=${search}`)
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [search]);

  // Extract unique genres from books
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(books.map(book => book.genre))];
    return uniqueGenres.sort();
  }, [books]);

  // Apply filters
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesAvailability = 
        !selectedAvailability || 
        (selectedAvailability === "available" && book.available) ||
        (selectedAvailability === "unavailable" && !book.available);
      
      return matchesGenre && matchesAvailability;
    });
  }, [books, selectedGenre, selectedAvailability]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedAvailability("");
  };

  const activeFiltersCount = [selectedGenre, selectedAvailability].filter(Boolean).length;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <FaBook className="text-white text-xl" />
            </div>
            <h2 className="text-5xl font-bold text-indigo-900">
              Explore Books
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Discover our extensive collection of books
          </p>
        </div>

        {/* Search Bar with Inline Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          {/* Search Input */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 text-lg" />
            <input
              placeholder="Search by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-indigo-200 rounded-2xl py-4 pl-14 pr-6 text-lg text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-md hover:shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors text-xl font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Inline Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
              {/* Genre Filter */}
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-white border-2 border-indigo-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={e => setSelectedAvailability(e.target.value)}
                className="bg-white border-2 border-indigo-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">All Availability</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all border border-indigo-200"
                >
                  <span>Clear</span>
                  <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                </button>
              )}
            </div>

            {/* Results Count */}
            {!loading && (
              <div className="text-sm text-gray-600 whitespace-nowrap">
                <span className="font-bold text-indigo-700">{filteredBooks.length}</span> of <span className="font-bold text-indigo-700">{books.length}</span> books
              </div>
            )}
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedGenre && (
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full border border-indigo-200">
                  <FaFilter className="text-xs" />
                  Genre: {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre("")}
                    className="hover:text-indigo-900 font-bold text-base"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedAvailability && (
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full border border-indigo-200">
                  <FaFilter className="text-xs" />
                  {selectedAvailability === "available" ? "Available" : "Unavailable"}
                  <button
                    onClick={() => setSelectedAvailability("")}
                    className="hover:text-indigo-900 font-bold text-base"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && filteredBooks.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                  }}
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Book Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-100">
                      <FaBook className="text-indigo-700 text-xl" />
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h4>

                    {/* Author */}
                    <p className="text-gray-600 mb-3 flex items-center gap-2">
                      <span className="text-xs text-indigo-500">✦</span>
                      <span className="font-medium text-sm">{book.author}</span>
                    </p>
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-2">
                      <span className="font-semibold text-indigo-500">📍</span>
                      <span>{book.bookPlace}</span>
                    </p>

                    {/* Genre Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                        {book.genre}
                      </span>
                    </div>

                    {/* Availability Status */}
                    <div className="pt-4 border-t border-gray-100">
                      {book.available ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <FaCheckCircle className="text-lg" />
                          <span className="font-semibold text-sm">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <FaTimesCircle className="text-lg" />
                          <span className="font-semibold text-sm">Not Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
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
        )}

        {/* No Results Message */}
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBook className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">
              {activeFiltersCount > 0 ? 'Try adjusting your filters or search terms' : search ? 'Try adjusting your search terms' : 'No books available at the moment'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
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