'use client';

import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { formatCurrency } from '@/app/utils/generateOrderId';
import { useRouter } from 'next/navigation';
import { Modal, ModalTitle, ModalHeader, ModalFooter, ModalBody } from 'react-bootstrap';

const Orders = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { orders } = useSelector((state) => state.orderReducer);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteOrder, setDeleteOrder] = useState(null);
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch orders on component mount and when filters change
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/pages/createUser');
            return;
        }

        dispatch(fetchOrders({ currentPage, sortOrder, dateFilter }));
    }, [currentPage, sortOrder, dateFilter, router, dispatch]);

    const ordersArr = useMemo(() => orders.orders || [], [orders.orders]);

    useEffect(() => {
        if (orders) {
            setTotalPages(orders.totalPages);
        }
    }, [orders]);

    const handleClose = useCallback(() => setShow(false), []);

    const handleOrderClick = (order) => {
        setSelectedOrder({
            tableId: order.tableId,
            orderId: order.orderId,
            total: order.total,
            orderStatus: order.status,
            orderItems: order.orders,
            discountType: order.discountType,
            discountValue: order.discountValue,
            discountTotal: order.discountTotal,
        });
    };

    const handleDeletePopUp = (orderNum) => {
        setShow(true);
        setDeleteOrder(orderNum);
    };

    const handleDeleteOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/pages/createUser');
            return;
        }

        try {
            const response = await fetch(`/api/orders?orderId=${deleteOrder}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                dispatch(fetchOrders({ currentPage, sortOrder, dateFilter }));
                handleClose();
            } else {
                const errorData = await response.json();
                console.error(`Error: ${errorData.message}`);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Failed to delete order:', error);
            alert('Failed to delete order');
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row flex-wrap justify-content-between">
                    <div className="d-flex col-md-9 p-3 flex-column">
                        <div className="sort-controls row col-md-12">
                            <div className='col-md-3'>
                                <label htmlFor="sortOrder">Sort by Date:</label>
                                <select
                                    id="sortOrder"
                                    className="form-control"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>

                            <div className='col-md-3'>
                                <label htmlFor="dateFilter">Filter by:</label>
                                <select
                                    id="dateFilter"
                                    className="form-control"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="currentWeek">This Week</option>
                                    <option value="previousWeek">Last Week</option>
                                </select>
                            </div>
                        </div>

                        <table className="table" style={{ height: 'fit-content' }}>
                            <thead>
                                <tr>
                                    <th scope="col">Order</th>
                                    <th scope="col">Table</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersArr.map((order) => (
                                    <tr key={order.orderId} onClick={() => handleOrderClick(order)}>
                                        <td>#{order.orderId}</td>
                                        <td><b>{order.tableId}</b></td>
                                        <td>{(order.date)?.split('T')[0]}</td>
                                        <td>{(order.date)?.split('T')[1]}</td>
                                        <td>{formatCurrency(order.total)}</td>
                                        <td>
                                            <div
                                                className={`border ${order.status === 'Unpaid' ? 'unpaid-yellow' : 'paid-gray'} 
                                                d-flex justify-content-center align-items-center p-1 rounded text-white`}
                                            >
                                                {order.status}
                                            </div>
                                        </td>
                                        <td>
                                            {order.status === 'Unpaid' && (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDeletePopUp(order.orderId)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-center">
                                    {/* Previous button */}
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                                            }}
                                            tabIndex={currentPage === 1 ? -1 : 0}
                                        >
                                            Previous
                                        </a>
                                    </li>

                                    {/* Dynamically render page numbers */}
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <a
                                                className="page-link"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(index + 1);
                                                }}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}

                                    {/* Next button */}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <a
                                            className="page-link"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                            }}
                                            tabIndex={currentPage === totalPages ? -1 : 0}
                                        >
                                            Next
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                        )}
                    </div>

                    {selectedOrder && (
                        <TableDetails orderObj={selectedOrder} />
                    )}
                </div>
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <ModalHeader closeButton>
                    <ModalTitle>Delete Order</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete the order?</p>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" onClick={handleDeleteOrder}>
                        Delete
                    </button>
                </ModalFooter>
            </Modal>
        </Layout>
    );
};

export default Orders;
