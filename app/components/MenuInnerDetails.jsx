

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { addOrder, updateOrder } from '../slices/ordersSlice';

const MenuInnerDetails = ({ option, handleQuantityChange, initialQuantity }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    console.log("this is option", option);
    const increment = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        handleQuantityChange(option.id, newQuantity);
        // dispatch(updateOrder({ tableId: option.tableid, orderId: option.id, quantity: newQuantity }));
    };

    const decrement = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            handleQuantityChange(option.id, newQuantity);
            // dispatch(updateOrder({ tableId: option.tableid, orderId: option.id, quantity: newQuantity }));

        };
    }

    return (


        <div key={option.id} className="card col-md-2 m-3 list-card border-0" >
            <div className="card-body d-flex justify-content-between align-items-start flex-column">
                <h6 className="card-title"> {option.name}</h6>
                <h6 className="card-subtitle mb-2 text-muted">Price:{option.price}</h6>
                <div className="d-flex justify-content-between align-items-center">
                    <button onClick={decrement} className="btn btn-sm bgGray2 text-white">-</button>
                    <span className='mx-2'>{quantity}</span>
                    <button onClick={increment} className="btn btn-sm bgGray2 text-white">+</button>
                </div>
            </div>

        </div>
    )
}

export default MenuInnerDetails;
