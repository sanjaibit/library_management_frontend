import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaBook, FaUser, FaMapMarkerAlt, FaTags, FaFileAlt, FaSave, FaTimes } from 'react-icons/fa';

export default function EditBookModal({ book, onClose, onUpdate }) {
    const [form, setForm] = useState({
        title: "",
        author: "",
        bookPlace: "",
        genre: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (book) {
            setForm({
                title: book.title || "",
                author: book.author || "",
                bookPlace: book.bookPlace || "",
                genre: book.genre || "",
                description: book.description || ""
            });
        }
    }, [book]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.author.trim()) newErrors.author = "Author is required";
        if (!form.bookPlace.trim()) newErrors.bookPlace = "Book Place is required";
        if (!form.genre.trim()) newErrors.genre = "Genre is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await api.put(`/admin/books/${book.id}`, form);
            onUpdate({ ...book, ...form });
            onClose();
        } catch (err) {
            alert(err.response?.data || "Error updating book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto  shadow-2xl transform transition-all animate-scaleIn [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FaBook /> Edit Book Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <FaBook className="text-indigo-500" /> Book Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className={`w-full bg-indigo-50 border-2 ${errors.title ? 'border-red-300' : 'border-indigo-200'} rounded-xl p-3 focus:border-indigo-500 focus:outline-none`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Author */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <FaUser className="text-indigo-500" /> Author
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            className={`w-full bg-indigo-50 border-2 ${errors.author ? 'border-red-300' : 'border-indigo-200'} rounded-xl p-3 focus:border-indigo-500 focus:outline-none`}
                        />
                        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* BookPlace */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <FaMapMarkerAlt className="text-indigo-500" /> Book Place
                            </label>
                            <input
                                type="text"
                                name="bookPlace"
                                value={form.bookPlace}
                                onChange={handleChange}
                                className={`w-full bg-indigo-50 border-2 ${errors.bookPlace ? 'border-red-300' : 'border-indigo-200'} rounded-xl p-3 focus:border-indigo-500 focus:outline-none`}
                            />
                            {errors.bookPlace && <p className="text-red-500 text-sm mt-1">{errors.bookPlace}</p>}
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                <FaTags className="text-indigo-500" /> Genre
                            </label>
                            <input
                                type="text"
                                name="genre"
                                value={form.genre}
                                onChange={handleChange}
                                className={`w-full bg-indigo-50 border-2 ${errors.genre ? 'border-red-300' : 'border-indigo-200'} rounded-xl p-3 focus:border-indigo-500 focus:outline-none`}
                            />
                            {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <FaFileAlt className="text-indigo-500" /> Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 focus:border-indigo-500 focus:outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
            <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}
