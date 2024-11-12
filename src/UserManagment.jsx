import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null); // State to hold user being edited
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      const response = await axios.delete(
        `https://m-store-server-ryl5.onrender.com/api/users/${userId}`
      );
      console.log('Response:', response.data);

      // Update state to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://m-store-server-ryl5.onrender.com/api/users/${editUser._id}`,
        {
          email: editUser.email,
          role: editUser.role,
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === editUser._id ? response.data : user))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="mt-4">User Management</h2>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control my-3"
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role === 'subadmin' ? `Sub-admin (${user.role})` : 'User'}</td>
              <td>{user._id}</td>
              <td>
                <button
                  onClick={() => handleEdit(user)}
                  className="btn btn-primary btn-sm mx-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-danger btn-sm mx-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && editUser && (
        <div className="modal show d-block" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser.email}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  {/* <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={editUser.role}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
