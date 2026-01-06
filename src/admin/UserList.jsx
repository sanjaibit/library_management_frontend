import { useEffect, useState } from "react";
import api from "../api/axios";
import { FaUser, FaEnvelope, FaUsers, FaSearch } from 'react-icons/fa';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const openEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: ""
    });
  };
  const saveUser = async () => {
    try {
      await api.put(`/admin/users/${selectedUser.id}`, editForm);
      alert("User updated");

      // update UI
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, username: editForm.username, email: editForm.email }
          : u
      ));

      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data || "Update failed");
    }
  };

  useEffect(() => {
    setLoading(true);
    api.get("/admin/users")
      .then(res => {
        setUsers(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
            <h3 className="text-5xl font-bold text-indigo-900">
              Users
            </h3>
          </div>
          <p className="text-gray-600 text-lg ml-15">
            Manage all registered users
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-indigo-200 rounded-lg py-3 pl-12 pr-4 text-gray-700 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-md"
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

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-bold text-indigo-700">{filteredUsers.length}</span> of <span className="font-bold">{users.length}</span> users
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u, index) => (
              <div
                key={u.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Card Header */}
                <div className="h-2 bg-indigo-600"></div>

                {/* Card Content */}
                <div className="p-6">
                  {/* User Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                      <FaUser className="text-white text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-indigo-900 truncate">
                        {u.username}
                      </h4>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <FaEnvelope className="text-indigo-600 text-sm" />
                      </div>
                      <span className="text-sm truncate">{u.email}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openEdit(u)}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Edit User
                  </button>

                </div>


              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-indigo-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
            </p>
          </div>
        )}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="absolute"
              onClick={() => setSelectedUser(null)}
            ></div>

            {/* Drawer */}
            <div className="ml-auto w-full max-w-md bg-white h-full shadow-2xl p-6 animate-slideIn">
              <h3 className="text-2xl font-bold text-indigo-900 mb-6">
                Edit User
              </h3>

              <div className="space-y-4">
                <input
                  value={editForm.username}
                  onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                  placeholder="Username"
                  className="w-full border-2 border-indigo-200 rounded-lg p-3"
                />

                <input
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email"
                  className="w-full border-2 border-indigo-200 rounded-lg p-3"
                />

                <input
                  type="password"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="New Password (optional)"
                  className="w-full border-2 border-indigo-200 rounded-lg p-3"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={saveUser}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
                >
                  Save
                </button>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
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
          @keyframes slideIn {
        from {
          transform: translateX(100%);
          }
        to {
          transform: translateX(0);
        }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

      `}</style>
    </div>
  );
}