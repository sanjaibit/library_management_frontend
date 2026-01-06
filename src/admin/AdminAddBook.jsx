import { useState } from "react";
import api from "../api/axios";
import { FaBook, FaUser, FaMapMarkerAlt, FaTags, FaFileAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';

export default function AdminAddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    bookPlace: "",
    genre: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!form.bookPlace.trim()) {
      newErrors.bookPlace = "Book Place is required";
    }

    if (!form.genre.trim()) {
      newErrors.genre = "Genre is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitBook = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await api.post("/admin/addbook", form);

      // Show success animation
      setSuccess(true);

      // Reset form after delay
      setTimeout(() => {
        setForm({
          title: "",
          author: "",
          bookPlace: "",
          genre: "",
          description: ""
        });
        setSuccess(false);
      }, 2000);

    } catch (err) {
      alert(err.response?.data || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      submitBook();
    }
  };

  const isFormFilled = form.title && form.author && form.bookPlace && form.genre;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <FaPlus className="text-white text-xl" />
            </div>
            <h2 className="text-5xl font-bold text-indigo-900">
              Add New Book
            </h2>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            Add a new book to the library collection
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-xl p-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-scaleIn">
                <FaCheckCircle className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-green-900 font-bold text-lg">Book Added Successfully!</h3>
                <p className="text-green-700 text-sm">The book has been added to the library collection.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaBook className="text-indigo-500" />
                <span>Book Title *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  value={form.title}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-indigo-50 border-2 ${errors.title ? 'border-red-300' : 'border-indigo-200'
                    } rounded-xl py-4 px-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all`}
                />
                {errors.title && (
                  <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <span>⚠</span> {errors.title}
                  </p>
                )}
              </div>
            </div>

            {/* Author Input */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaUser className="text-indigo-500" />
                <span>Author *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="author"
                  placeholder="Enter author name"
                  value={form.author}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-indigo-50 border-2 ${errors.author ? 'border-red-300' : 'border-indigo-200'
                    } rounded-xl py-4 px-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all`}
                />
                {errors.author && (
                  <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <span>⚠</span> {errors.author}
                  </p>
                )}
              </div>
            </div>

            {/* BookPlace and Genre Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* BookPlace Input */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <FaMapMarkerAlt className="text-indigo-500" />
                  <span>Book Place *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="bookPlace"
                    placeholder="e.g., Shelf A-123"
                    value={form.bookPlace}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full bg-indigo-50 border-2 ${errors.bookPlace ? 'border-red-300' : 'border-indigo-200'
                      } rounded-xl py-4 px-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all`}
                  />
                  {errors.bookPlace && (
                    <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                      <span>⚠</span> {errors.bookPlace}
                    </p>
                  )}
                </div>
              </div>

              {/* Genre Input */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <FaTags className="text-indigo-500" />
                  <span>Genre *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="genre"
                    placeholder="e.g., Fiction, Science, History"
                    value={form.genre}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full bg-indigo-50 border-2 ${errors.genre ? 'border-red-300' : 'border-indigo-200'
                      } rounded-xl py-4 px-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all`}
                  />
                  {errors.genre && (
                    <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                      <span>⚠</span> {errors.genre}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaFileAlt className="text-indigo-500" />
                <span>Description</span>
                <span className="text-gray-400 text-sm font-normal">(Optional)</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter book description or summary..."
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl py-4 px-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
              />
              <p className="mt-2 text-gray-500 text-sm">
                {form.description.length} characters
              </p>
            </div>

            {/* Required Fields Note */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4">
              <p className="text-indigo-900 text-sm">
                <span className="font-bold">Note:</span> Fields marked with * are required
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitBook}
              disabled={loading || !isFormFilled}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${loading
                ? 'bg-indigo-400 text-white cursor-wait shadow-lg'
                : !isFormFilled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Book...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaPlus />
                  Add Book to Library
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border border-indigo-100">
          <h3 className="text-indigo-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Tips for Adding Books
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Double-check the Book Place (e.g., A-123) to ensure accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Use consistent genre naming for better organization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Include a brief description to help users find the right book</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Press Enter to quickly submit the form</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}