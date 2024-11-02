'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { formatCurrency, generateOrderId } from '../utils/generateOrderId';
import { fetchOrders } from '../slices/ordersSlice';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { hideLoader, showLoader } from '../slices/siteSettingSlice';
import OrderManagement from './OrderManagement';
import { showNotification } from '../slices/siteSettingSlice';
const OrderTable = ({ orderItems, handleQuantityChange }) => (
    <div className='mt-3 order-table' style={{ overflowY: 'scroll', maxHeight: '40vh', overflowX: 'hidden' }}>
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
                        {/* <td>{item.quantity}</td> */}
                        <td><OrderManagement option={item} handleQuantityChange={handleQuantityChange} initialQuantity={item.quantity} /></td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const OrderStatusSelect = ({ status, setStatus }) => (
    <select
        className="form-control form-control-sm dropdown edit-btn"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
    >
        <option value="" disabled>Order Status</option>
        <option className='dropdown-item' value="Paid">Paid</option>
        <option className='dropdown-item' value="Unpaid">Unpaid</option>
    </select>
);

const TableDetails = ({ orderObj, handleQuantityChange }) => {
    const { tableid, orderId, orderStatus, orderItems = [], total, discountType, discountValue } = orderObj;
    console.log("This is tableid",tableid);

    const [loginToken, setLoginToken] = useState();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const [oStatus, setOStatus] = useState('Unpaid');
    const [dType, setDType] = useState('rs');
    const [dValue, setDValue] = useState('0');


    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

        if (!token) {
            // Redirect to login if no token is found
            router.push('/pages/createUser');
            return;
        } else {
            setLoginToken(token);
        }
        if (orderStatus) setOStatus(orderStatus);
        if (discountType) setDType(discountType);
        if (discountValue) setDValue(String(discountValue));

    }, [orderStatus, router, discountType, discountValue]);


    // console.log("this is dvalue",dValue);


    const calculateDiscountedTotal = () => {
        let discountAmount = 0;
        if (dType === 'percent') {
            discountAmount = (dValue / 100) * total;  // Calculate percentage discount
        } else if (dType === 'rs') {
            discountAmount = dValue;  // Fixed discount in rupees
        }
        const discountedTotal = total - discountAmount;
        // setDiscountTotal(discountedTotal < 0 ? 0 : discountedTotal);  // Calculate total after discount
        return discountedTotal < 0 ? 0 : discountedTotal; // Prevent negative total
    };

    const addUpdateOrder = async () => {
        dispatch(showLoader(true));
        const payload = {
            orderId: orderId || generateOrderId(),
            tableId: tableid,
            orders: orderItems,
            total,
            date: new Date().toISOString(),
            status: oStatus,
            discountType: dType || 'rs',  // Capture discount type
            discountValue: dValue || 0,   // Capture discount value
            discountTotal: Number(calculateDiscountedTotal()),  // Capture discount total
        };

        console.log("This sis ===>>>",payload);
        const method = orderId ? 'PUT' : 'POST';
        const url = orderId ? `/api/orders/?orderId=${orderId}` : '/api/orders';
        console.log("this is paload,url", payload, url);

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
                dispatch(showNotification({ message: `Authorisation error`, type: "error" }));
                setTimeout(()=>{
                    router.push('/pages/createUser');

                },(2000));

                return;
            }
            if (response.status === 500 ) {
                dispatch(hideLoader(true));
                // router.push('/pages/createUser');
                dispatch(showNotification({ message: `Error ${orderId ? ' updating' : 'adding'} order`, type: "error" }));


                return;
            }

            if (response.ok) {
                dispatch(hideLoader(true));
                dispatch(showNotification({ message: `${orderId ? 'Order updated' : 'Order added'} successfully`, type: "success" }));
                console.log(`${orderId ? 'Order updated' : 'Order added'} successfully`);
                if (orderId) dispatch(fetchOrders());
                setTimeout(()=>{
                    router.push('/pages/orders');
                },(2000));

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
                <OrderTable orderItems={orderItems} handleQuantityChange={handleQuantityChange} />
            </div>
            <div>

                <table className='table border-top bgWhite2'>
                    <thead>
                        <tr>
                            <th>
                                <label htmlFor='dis-type'>Discount:</label>
                                <select
                                    id='dis-type'
                                    value={dType}
                                    onChange={(e) => setDType(e.target.value)}
                                    className='form-control form-control-sm col-md-6'
                                >
                                    <option value="">Select</option>
                                    <option value="rs">(₹)</option>
                                    <option value="percent">(%)</option>
                                </select>
                            </th>
                            <th>
                                <input
                                    id='dvalue'
                                    type="text"
                                    value={dValue}
                                    onChange={(e) => setDValue(Number(e.target.value))}
                                    placeholder="Enter discount value"
                                    className='form-control form-control-sm col-md-6'
                                />
                            </th>
                        </tr>
                        <tr>
                            <th className='fs-3'>Total</th>
                            <th className='fs-5 align-content-center'>{formatCurrency(total)}</th>
                        </tr>
                        <tr>
                            <th className='fs-8'>Discounted Total</th>
                            <th className='fs-8 align-content-center'>{formatCurrency(calculateDiscountedTotal())}</th>
                        </tr>
                        <tr>

                            <td className='border-0'>
                                <OrderStatusSelect status={oStatus} setStatus={setOStatus} />
                            </td>
                            <td className='border-0'>
                                {/* <Link href="/pages/orders" passHref> */}
                                    <button type="button" className="btn mt-3 add-btn form-control form-control-sm" onClick={addUpdateOrder}>
                                        {orderId ? 'Update Order' : 'Add order'}
                                    </button>
                                {/* </Link> */}
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default TableDetails;
