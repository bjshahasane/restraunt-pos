'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { formatCurrency, generateOrderId } from '../utils/generateOrderId';
import { fetchOrders } from '../slices/ordersSlice';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { usePathname,useRouter } from 'next/navigation';
import {toast } from 'react-toastify';
import { hideLoader, showLoader } from '../slices/siteSettingSlice';

const OrderTable = ({ orderItems }) => (
    <div className='mt-3' style={{ overflowY: 'scroll', maxHeight: '40vh', overflowX: 'hidden' }}>
        <table className="table bgWhite2">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                </tr>
            </thead>
            <tbody>
                {orderItems.map((item) => (
                    <tr key={item.id}>
                        <th scope="row">{item.name}</th>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const OrderStatusSelect = ({ status, setStatus }) => (
    <select
        className="form-control dropdown edit-btn"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
    >
        <option value="" disabled>Order Status</option>
        <option className='dropdown-item' value="Paid">Paid</option>
        <option className='dropdown-item' value="Unpaid">Unpaid</option>
    </select>
);

const TableDetails = ({ tableid, orderItems = [], total, orderId, orderStatus }) => {
    const [loginToken,setLoginToken] = useState();
    console.log("This is tableID",tableid);
    const dispatch = useDispatch();
    const pathname = usePathname();
  const router = useRouter();

    const [oStatus, setOStatus] = useState('Unpaid');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

        if (!token) {
            // Redirect to login if no token is found
            router.push('/pages/createUser');
            return;
        }else{
            setLoginToken(token);
        }
        if (orderStatus) setOStatus(orderStatus);
    }, [orderStatus,router]);

  
    const addUpdateOrder = async () => {
        dispatch(showLoader(true));
        const payload = {
            orderId: orderId || generateOrderId(),
            tableId: tableid,
            orders: orderItems,
            total,
            date: new Date().toISOString(),
            status: oStatus,
        };

        const method = orderId ? 'PUT' : 'POST';
        const url = orderId ? `/api/orders/?orderId=${orderId}` : '/api/orders';

        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                 },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            if (response.status === 401 || response.status === 403) {
                dispatch(hideLoader(true));
                router.push('/pages/createUser');
                return;
              }

            if (response.ok) {
                dispatch(hideLoader(true));
                console.log(`${orderId ? 'Order updated' : 'Order added'} successfully`);
                if (orderId) dispatch(fetchOrders());
                
            } else {
                dispatch(hideLoader(true));
                console.error('Error processing order:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='d-flex flex-column justify-content-between col-md-3 border-0 p-4 rounded detail-box mt-3' style={{ height: '90vh', maxWidth: '90vh' }}>
            <div>
                {pathname.includes('orders') && (
                    <div className='d-flex justify-content-end'>
                        <Link href={`/pages/menus/${tableid}/${orderId}`} passHref>
                            <button type="button" className="btn edit-btn m-3">Edit order</button>
                        </Link>
                    </div>
                )}
                <div className='row'>
                    <h2 className='col'>Table {tableid}</h2>
                    {orderId && <h6 className='col align-content-center'>order #{orderId}</h6>}
                </div>
                <OrderTable orderItems={orderItems} />
            </div>
            <div>
                <table className='table border-top bgWhite2'>
                    <thead>
                        <tr>
                            <th className='fs-2'>Total</th>
                            <th className='fs-4 align-content-center'>{formatCurrency(total)}</th>
                        </tr>
                        <tr>
                            <td className='border-0'>
                                <OrderStatusSelect status={oStatus} setStatus={setOStatus} />
                            </td>
                            <td className='border-0'>
                                <Link href="/pages/orders" passHref>
                                    <button type="button" className="btn mt-3 add-btn" onClick={addUpdateOrder}>
                                        {orderId ? 'Update Order' : 'Add order'}
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default TableDetails;
