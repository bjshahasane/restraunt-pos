'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Clear the token from localStorage
        localStorage.removeItem('token');

        // Redirect the user to the login page
        router.push('/');
    }, [router]);

    return (
        <div className="container">
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;
