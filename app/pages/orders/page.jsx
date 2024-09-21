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
                                </tr>
                            </thead>
                            <tbody>
                                {ordersArr.map((order) => (
                                    <tr key={order.orderId} onClick={() => handleOrderClick(order)}>
                                        <td>Table-{order.tableId}</td>
                                        <td>{order.orderId}</td>
                                        <td>{(order.date)?.split('T')[0]}</td>
                                        <td>{formatCurrency(order.total)}</td>
                                        <td>
                                            <div className={`border ${order.status === "Unpaid" ? "unpaid-yellow" : "paid-gray"} d-flex justify-content-center align-items-center p-1 rounded text-white`}>
                                                {order.status}
                                            </div>
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
