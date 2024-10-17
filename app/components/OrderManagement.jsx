'use Client'

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from 'next/navigation';


const OrderManagement = ({ option, handleQuantityChange, initialQuantity }) => {

    const pathname = usePathname();

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
        <div className="d-flex justify-content-between align-items-center">
            {!pathname.includes('orders') ? (
                <>
                    <button onClick={decrement} className="btn btn-sm bgGray2 text-white">-</button>
                    <span className="mx-2">{quantity}</span>
                    <button onClick={increment} className="btn btn-sm bgGray2 text-white">+</button>
                </>

            ):(  <span className="mx-2">{quantity}</span>)}
        </div>

    )
}

export default OrderManagement