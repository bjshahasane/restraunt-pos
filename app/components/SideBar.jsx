import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const SideBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [username, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (name) {
            setUserName(name);
        }
        if (role) {
            setUserRole(role);
        }
    }, [])

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="col-auto px-sm-2 px-0 bgGray2">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white min-vh-100">
                <div className="pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Hote Aryan</span>
                </div>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item mb-2">
                        <Link href="/pages/tables" className="nav-link align-middle px-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                            </svg>
                            <span className="ms-3 d-none d-sm-inline">Tables</span>
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link href="/pages/menus" className="nav-link px-0 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-table" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z" />
                            </svg>
                            <span className="ms-3 d-none d-sm-inline">Menus</span>
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link href="/pages/orders" className="nav-link px-0 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                            <span className="ms-3 d-none d-sm-inline">Orders</span>
                        </Link>
                    </li>
                </ul>
                <div className="dropdown mt-auto mb-3">
                    <a className="nav-link dropdown-toggle px-0 align-middle" href="#" id="dropdownMenuButton" onClick={toggleDropdown}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                        </svg>
                        <span className="ms-1 d-none d-sm-inline">{username}</span>
                    </a>
                    <ul className="dropdown-menu" style={{ display: dropdownOpen ? 'block' : 'none' }}>
                        {
                            userRole !== "staff" && (
                                <li><a className="dropdown-item" href="/pages/users">Users</a></li>
                            )
                        }
                        <li><a className="dropdown-item" href="/pages/logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
