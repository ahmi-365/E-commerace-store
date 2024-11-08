import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, Modal } from 'react-bootstrap';

const AdminDash = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [newSubAdmin, setNewSubAdmin] = useState({ email: '', role: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState(['Products Admin', 'Order Admin', 'Coupon Admin']);

  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/admin/subadmins', { withCredentials: true });
        setSubAdmins(response.data);
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
        setError("Failed to load sub-admins. Please try again.");
      }
    };
    fetchSubAdmins();
  }, []);

  const handleCreateOrUpdateSubAdmin = async () => {
    if (newSubAdmin.password !== newSubAdmin.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      if (isUpdating) {
        // Update existing sub-admin
        await axios.put(`https://m-store-server-ryl5.onrender.com/api/admin/subadmins/${currentAdminId}`, {
          email: newSubAdmin.email,
          role: newSubAdmin.role,
          password: newSubAdmin.password,
        }, {
          withCredentials: true,
        });

        setSubAdmins(subAdmins.map(admin => 
          admin._id === currentAdminId ? { ...admin, email: newSubAdmin.email, role: newSubAdmin.role } : admin
        ));
        setSuccessMessage("Sub-admin updated successfully!");
      } else {
        // Create new sub-admin
        const response = await axios.post('https://m-store-server-ryl5.onrender.com/api/admin/subadmins', {
          email: newSubAdmin.email,
          role: newSubAdmin.role,
          password: newSubAdmin.password,
        }, {
          withCredentials: true,
        });

        setSubAdmins([...subAdmins, response.data]);
        setSuccessMessage("Sub-admin created successfully!");
      }

      setShowModal(false);
      setNewSubAdmin({ email: '', role: '', password: '', confirmPassword: '' });
      setError('');
      setIsUpdating(false);
      setCurrentAdminId(null);
    } catch (error) {
      console.error("Error creating/updating sub-admin:", error);
      setError("Failed to create/update sub-admin. Please try again.");
    }
  };

  const handleDeleteSubAdmin = async (id) => {
    try {
      await axios.delete(`https://m-store-server-ryl5.onrender.com/api/admin/subadmins/${id}`, {
        withCredentials: true,
      });
      setSubAdmins(subAdmins.filter(admin => admin._id !== id));
      setSuccessMessage("Sub-admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
      setError("Failed to delete sub-admin. Please try again.");
    }
  };

  const openUpdateModal = (admin) => {
    setNewSubAdmin({ email: admin.email, role: admin.role, password: '', confirmPassword: '' });
    setCurrentAdminId(admin._id);
    setIsUpdating(true);
    setShowModal(true);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subAdmins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <Button variant="warning" onClick={() => openUpdateModal(admin)}>Update</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteSubAdmin(admin._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update Sub-Admin" : "Create Sub-Admin"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newSubAdmin.email}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={newSubAdmin.password}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={newSubAdmin.confirmPassword}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, confirmPassword: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newSubAdmin.role}
                onChange={(e) => setNewSubAdmin({ ...newSubAdmin, role: e.target.value })}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreateOrUpdateSubAdmin}>
            {isUpdating ? "Update Sub-Admin" : "Create Sub-Admin"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDash;
