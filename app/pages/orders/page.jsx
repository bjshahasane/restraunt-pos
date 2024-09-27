'use client';

import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { formatCurrency } from '@/app/utils/generateOrderId';
import { useRouter } from 'next/navigation';

const Orders = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { orders } = useSelector((state) => state.orderReducer);

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

        if (!token) {
            // Redirect to login if no token is found
            router.push('/pages/createUser');
            return;
        }
        dispatch(fetchOrders());
    }, [dispatch]);

    const ordersArr = useMemo(() => orders || [], [orders]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleDeleteOrder = async (orderId) => {
        const token = localStorage.getItem('token'); // Retrieve JWT token

        if (!token) {
            router.push('/pages/createUser');
            return;
        }

        try {
            const response = await fetch(`/api/orders?orderId=${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                dispatch(fetchOrders()); // Refresh the order list after deletion
                alert('Order deleted successfully');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order');
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className="row flex-wrap justify-content-between">
                    <div className='row col-md-9 p-3'>
                        <table className="table" style={{ height: "fit-content" }}>
                            <thead>
                                <tr>
                                    <th scope="col">Table</th>
                                    <th scope="col">Order</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th> {/* New Actions column */}
                                </tr>
                            </thead>
                            <tbody>
                                {ordersArr.map((order) => (
                                    <tr key={order.orderId}>
                                        <td onClick={() => handleOrderClick(order)}>Table-{order.tableId}</td>
                                        <td onClick={() => handleOrderClick(order)}>{order.orderId}</td>
                                        <td onClick={() => handleOrderClick(order)}>{(order.date)?.split('T')[0]}</td>
                                        <td onClick={() => handleOrderClick(order)}>{formatCurrency(order.total)}</td>
                                        <td onClick={() => handleOrderClick(order)}>
                                            <div className={`border ${order.status === "Unpaid" ? "unpaid-yellow" : "paid-gray"} d-flex justify-content-center align-items-center p-1 rounded text-white`}>
                                                {order.status}
                                            </div>
                                        </td>
                                        <td>
                                            {/* Delete button */}
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => handleDeleteOrder(order.orderId)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedOrder && (
                        <TableDetails
                            tableid={selectedOrder.tableId}
                            orderItems={selectedOrder.orders}
                            total={selectedOrder.total}
                            orderId={selectedOrder.orderId}
                            orderStatus={selectedOrder.status}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
