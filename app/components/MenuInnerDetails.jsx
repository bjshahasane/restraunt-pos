import React, { useState, useEffect, useCallback } from 'react';

const MenuInnerDetails = ({ option, handleQuantityChange, initialQuantity }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const updateQuantity = useCallback(
        (newQuantity) => {
            setQuantity(newQuantity);
            handleQuantityChange(option.id, newQuantity);
        },
        [handleQuantityChange, option.id]
    );

    const increment = useCallback(() => {
        updateQuantity(quantity + 1);
    }, [quantity, updateQuantity]);

    const decrement = useCallback(() => {
        if (quantity > 0) {
            updateQuantity(quantity - 1);
        }
    }, [quantity, updateQuantity]);

    return (
        <div key={option.id} className="card col-md-2 m-3 list-card border-0">
            <div className="card-body d-flex justify-content-between align-items-start flex-column">
                <h6 className="card-title">{option.name}</h6>
                <h6 className="card-subtitle mb-2 text-muted">Price: {option.price}</h6>
                <div className="d-flex justify-content-between align-items-center">
                    <button onClick={decrement} className="btn btn-sm bgGray2 text-white">-</button>
                    <span className="mx-2">{quantity}</span>
                    <button onClick={increment} className="btn btn-sm bgGray2 text-white">+</button>
                </div>
            </div>
        </div>
    );
};

export default MenuInnerDetails;
