import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const AdminDash = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [newSubAdmin, setNewSubAdmin] = useState({
    email: '',
    role: '',
    permissions: [],  // Add permissions field
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/roles');
        setRoles(response.data.map(role => role.name)); // Map roles to an array of role names
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchSubAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/admin/subadmins', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setSubAdmins(response.data);
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
        setError("Failed to load sub-admins. Please try again.");
      }
    };

    fetchRoles();
    fetchSubAdmins();
  }, []);

  const handleDeleteSubAdmin = async (id) => {
    try {
      const response = await axios.delete(`https://m-store-server-ryl5.onrender.com/api/admin/subadmins/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccessMessage(response.data.message);
      setSubAdmins(subAdmins.filter(admin => admin._id !== id));
    } catch (error) {
      setError("Failed to delete sub-admin.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isUpdating) {
        response = await axios.put(
          `https://m-store-server-ryl5.onrender.com/api/admin/subadmins/${currentAdminId}`,
          newSubAdmin, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      } else {
        response = await axios.post(
          'https://m-store-server-ryl5.onrender.com/api/admin/subadmins', 
          newSubAdmin, 
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }

      setSuccessMessage(isUpdating ? 'Sub-admin updated successfully!' : 'Sub-admin created successfully!');
      setShowModal(false);
      fetchSubAdmins();
    } catch (error) {
      setError("Failed to submit.");
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      
      {successMessage && <p className="text-success">{successMessage}</p>}
      {error && <p className="text-danger">{error}</p>}

      <Button variant="primary" onClick={() => { setShowModal(true); setIsUpdating(false); }}>
        Create Sub-Admin
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Permissions</th> {/* Display Permissions */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subAdmins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>{(admin.permissions || []).join(', ')}</td> {/* Show permissions */}
              <td>
                <Button variant="warning" onClick={() => openUpdateModal(admin)}>Update</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteSubAdmin(admin._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for creating/updating sub-admin */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? 'Update Sub-Admin' : 'Create Sub-Admin'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newSubAdmin.email}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newSubAdmin.role}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, role: e.target.value })}
                required
              >
                <option value="productAdmin">Product Admin</option>
                <option value="orderAdmin">Order Admin</option>
                <option value="superAdmin">Super Admin</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPermissions">
              <Form.Label>Permissions</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={newSubAdmin.permissions.join(', ')}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, permissions: e.target.value.split(', ') })}
                placeholder="Enter permissions separated by commas"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newSubAdmin.password}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={newSubAdmin.confirmPassword}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, confirmPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">{isUpdating ? 'Update' : 'Create'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDash;
