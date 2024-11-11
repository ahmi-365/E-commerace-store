import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleManage = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({
    manageProducts: false,
    viewOrders: false,
    manageUsers: false,
  });

  // Fetch roles from the backend on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    const newRole = {
      name: roleName,
      permissions: Object.keys(permissions).filter((perm) => permissions[perm]),
    };

    try {
      const response = await axios.post(
        'https://m-store-server-ryl5.onrender.com/api/roles',
        newRole
      );
      setRoles([...roles, response.data]);
      setRoleName('');
      setPermissions({ manageProducts: false, viewOrders: false, manageUsers: false });
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const togglePermission = (permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission],
    }));
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Role Management</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title">Create New Role</h4>
          <div className="form-group mb-3">
            <label htmlFor="roleName">Role Name</label>
            <input
              type="text"
              className="form-control"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <h5 className="mb-3">Assign Permissions:</h5>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="manageProducts"
              checked={permissions.manageProducts}
              onChange={() => togglePermission('manageProducts')}
            />
            <label className="form-check-label" htmlFor="manageProducts">
              Manage Products
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="viewOrders"
              checked={permissions.viewOrders}
              onChange={() => togglePermission('viewOrders')}
            />
            <label className="form-check-label" htmlFor="viewOrders">
              View Orders
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="manageUsers"
              checked={permissions.manageUsers}
              onChange={() => togglePermission('manageUsers')}
            />
            <label className="form-check-label" htmlFor="manageUsers">
              Manage Users
            </label>
          </div>

          <button className="btn btn-primary" onClick={handleCreateRole}>
            Create Role
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Existing Roles</h4>
          <ul className="list-group">
            {roles.map((role) => (
              <li key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{role.name}</strong> - Permissions: {role.permissions.join(', ')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoleManage;
