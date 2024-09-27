// Loader.js
import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader } from '../slices/siteSettingSlice'; // Import the hideLoader action

const Loader = () => {
    const dispatch = useDispatch();
    const loader = useSelector((state) => state.siteSettings.loader);

    useEffect(() => {
        // If loader is hidden, we can set a timeout to hide it
        if (!loader.show) {
            const timer = setTimeout(() => {
                dispatch(hideLoader(false)); // Ensure loader hides after some time if needed
            }, 1000); // You can adjust this duration

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [loader.show, dispatch]);

    if (!loader.show) return null; // Don't render anything if loader is not shown

    return (
        <div className="loader-container">
            <div className="loader-background"></div>
            <Spinner animation="border" variant="light" className="loader" />
        </div>
    );
};

export default Loader;
