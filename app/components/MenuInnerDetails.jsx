import React from 'react';
import OrderManagement from './OrderManagement';

const MenuInnerDetails = ({ option, handleQuantityChange, initialQuantity }) => {
    

    return (
        <div key={option.id} className="card col-md-2 m-3 list-card border-0">
            <div className="card-body d-flex justify-content-between align-items-start flex-column">
                <h6 className="card-title">{option.name}</h6>
                <h6 className="card-subtitle mb-2 text-muted">Price: {option.price}</h6>
                <OrderManagement option={option} handleQuantityChange={handleQuantityChange} initialQuantity={initialQuantity}/>
            </div>
        </div>
    );
};

export default MenuInnerDetails;
