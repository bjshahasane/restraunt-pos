'use client'

import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { formatCurrency } from '@/app/utils/generateOrderId';

const Orders = () => {

    const dispatch = useDispatch()
    const store = useSelector((state) => state.orderReducer);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [ordersArr, setOrdersArr] = useState([])

    useEffect(() => {
        if (store.orders) {
            setOrdersArr(store.orders);
        }
    }, [store])

    useEffect(() => {
        dispatch(fetchOrders());
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setOrderStatus(order.status)
    };
    console.log("this is selected", selectedOrder);

    return (
        <Layout>
            <div className='container'>
                <div className="row flex-wrap justify-content-between">
                    <div className='row col-md-9 p-3'>
                        <table className="table" style={{height:"fit-content"}}>
                            <thead>
                                <tr>
                                    <th scope="col">Table</th>
                                    <th scope="col">Order</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody >
                                {ordersArr.length > 0 && ordersArr.map((order) => (
                                    <tr key={order.orderId} onClick={() => handleOrderClick(order)}>
                                        <td>Table-{order.tableId}</td>
                                        <td>{order.orderId}</td>
                                        <td>{order.date}</td>
                                        <td>{formatCurrency(order.total)}</td>
                                        <td>
                                            <div className={`border ${order.status == "Unpaid" ? "unpaid-yellow" :  "paid-gray"} d-flex justify-content-center align-items-center p-1 rounded text-white`}>
                                                {order.status}

                                            </div>
                                        </td>
                                    </tr>
                                    // <span>{order}</span>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    {selectedOrder && (
                        <TableDetails tableid={selectedOrder.tableId} orderItems={selectedOrder.orders} total={selectedOrder.total} orderId={selectedOrder.orderId} orderStatus={orderStatus}/>
                    )}
                </div>
            </div>
        </Layout>

    )
}

export default Orders;
