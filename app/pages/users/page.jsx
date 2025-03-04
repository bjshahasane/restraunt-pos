'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/app/slices/siteSettingSlice';

const Users = () => {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingUserData, setEditingUserData] = useState({ name: '', email: '', role: 'user' });
    const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'user',password:'' });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        dispatch(showLoader(true));
        const token = localStorage.getItem('token');
        const response = await fetch('/api/signup', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        dispatch(hideLoader(true));
        setUsers(data.users);
    };

    const handleEditChange = (e) => {
        setEditingUserData({ ...editingUserData, [e.target.name]: e.target.value });
    };

    const handleNewUserChange = (e) => {
        setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    };

    const handleUpdateUser = async (userId) => {
        dispatch(showLoader(true));
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/signup?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingUserData),
        });

        if (response.ok) {
            dispatch(hideLoader(true));
            setEditingUserId(null);
            fetchUsers(); // Refresh user list
        } else {
            dispatch(hideLoader(true));
            console.error('Error updating user');
        }
    };

    const handleDeleteUser = async (userId) => {
        dispatch(showLoader(true));
        const token = localStorage.getItem('token');
        await fetch(`/api/signup?userId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        fetchUsers();
        dispatch(hideLoader(true)) // Refresh user list
    };

    const handleAddUser = async () => {
        dispatch(showLoader(true));
        const token = localStorage.getItem('token');
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });

        if (response.ok) {
            dispatch(hideLoader(true));
            setNewUserData({ name: '', email: '', role: 'staff',password:'' });
            setShowModal(false);
            fetchUsers(); // Refresh user list
        } else {
            console.error('Error adding user');
            dispatch(hideLoader(true));
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <h1 className="mb-4">Manage Users</h1>
                <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                    Add User
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                {editingUserId === user._id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={editingUserData.name}
                                                onChange={handleEditChange}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={editingUserData.email}
                                                onChange={handleEditChange}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="role"
                                                className="form-select"
                                                value={editingUserData.role}
                                                onChange={handleEditChange}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="superadmin">Superadmin</option>
                                                <option value="admin">Admin</option>
                                                <option value="staff">Staff</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => handleUpdateUser(user._id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setEditingUserId(null);
                                                    setEditingUserData({ name: '', email: '', role: 'user' });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => {
                                                    setEditingUserId(user._id);
                                                    setEditingUserData({ name: user.name, email: user.email, role: user.role });
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Adding User */}
                {showModal && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add User</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setShowModal(false)}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={newUserData.name}
                                            onChange={handleNewUserChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={newUserData.email}
                                            onChange={handleNewUserChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={newUserData.password}
                                            onChange={handleNewUserChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select
                                            name="role"
                                            className="form-control"
                                            value={newUserData.role}
                                            onChange={handleNewUserChange}
                                        >
                                            <option value="superadmin">Superadmin</option>
                                            <option value="admin">Admin</option>
                                            <option value="staff">Staff</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleAddUser}>
                                        Add User
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Users;
