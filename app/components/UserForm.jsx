'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Tab, Tabs } from "react-bootstrap";
import Loader from "./Loader";
import { hideLoader, showLoader } from "../slices/siteSettingSlice";
import { useDispatch } from "react-redux";
const UserForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "superadmin" });
    const [message, setMessage] = useState("");
    const [canSignup, setCanSignup] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push("/"); // Redirect to home if user is already logged in
        }
        checkSuperAdmin();

    }, [router]);

    const checkSuperAdmin = async () => {
        dispatch(showLoader(true));
        try {
            const response = await fetch('/api/check-superadmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.exists) {
                dispatch(hideLoader(true));
                setCanSignup(false); 
                setActiveTab('login')// Disable signup if superadmin exists
                console.log("this is super",result.exists);
            } else {
                dispatch(hideLoader(true));

                setCanSignup(true); // Allow signup if superadmin doesn't exist
                setActiveTab('signup');// Disable signup if superadmin exists
            }
        } catch (error) {
            dispatch(hideLoader(true));

            console.error('Error checking superadmin:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(showLoader(true));

        const url = activeTab === 'signup' ? '/api/signup' : '/api/login';
        const body = activeTab === 'signup'
            ? formData
            : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                dispatch(hideLoader(true));

                setFormData({ name: '', email: '', password: '', role: '' });
                if (activeTab === 'login') {
                    console.log("This is result",result);
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('role', result.user.role); 
                    localStorage.setItem('name', result.user.name); 
                    localStorage.setItem('email', result.user.email); 
                    router.push("/"); 
                }else{
                    router.push("/");
                }
            }
        } catch (error) {
            dispatch(hideLoader(true));

            console.error('Error:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };


    return (
        <>
     
         <div className="container mt-5">
            <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
                <CardHeader>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="mb-3"
                    >
                        <Tab eventKey="login" title="Login" />
                        {canSignup && <Tab eventKey="signup" title="Signup" />} 
                    </Tabs>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        {activeTab === 'signup' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        placeholder="Enter role"
                                        disabled
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn add-btn mt-3">
                            {activeTab === 'signup' ? 'Signup' : 'Login'}
                        </button>
                    </form>
                    {message && <div className="alert alert-info mt-3">{message}</div>}
                </CardBody>
            </Card>
        </div>
        </>
       
    );
}

export default UserForm;
