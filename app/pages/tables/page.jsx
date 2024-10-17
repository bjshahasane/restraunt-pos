'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { selectTable, fetchOrders } from '../../slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';
import { useRouter } from 'next/navigation';

const Tables = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const store = useSelector((state) => state.orderReducer);
  const [ordersArr, setOrdersArr] = useState([]);

  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    if (!token) {
      // Redirect to login if no token is found
      router.push('/pages/createUser');
      return;
    }
    dispatch(fetchMenu());
    dispatch(fetchOrders({ isTableCheck: true }));
  }, [dispatch]);

  useEffect(() => {
    if (store.orders.orders) {
      setOrdersArr(store.orders.orders);
    }
  }, [store.orders]);

  const isTableUnpaid = (tableId) => {
    return ordersArr.some((order) => {
      return Number(order.tableId) === tableId && order.status === 'Unpaid';
    });
  };

  const getOrderForTable = (tableId) => {
    const order = ordersArr.find((order) => Number(order.tableId) === tableId && order.status === 'Unpaid');
    return order ? order.orderId : null;
  };

  const handleTableClick = (tableId) => {
    const orderId = getOrderForTable(tableId);
    dispatch(selectTable(tableId))
    if (orderId) {
      // Redirect to order details page if the table is occupied
      router.push(`/pages/menus/${tableId}/${orderId}`);
    } else {
      // Redirect to the menu page if the table is vacant
      router.push(`/pages/menus/${tableId}`);
    }
  };

  const renderedTables = useMemo(() => {
    return tableNumbers.map((tableId) => (
      <div
        key={tableId}
        className={`card col-sm-5 col-md-2 m-2 table-card border-0 ${isTableUnpaid(tableId) ? 'disabled-link' : ''
          }`}
        onClick={() => handleTableClick(tableId)}
      >
        {/* <Link href={`/pages/menus/${tableId}`}> */}
        <div className="card-body">
          <h5 className="card-title">Table {tableId}</h5>
          <p className="card-text">{isTableUnpaid(tableId) ? 'Occupied' : 'Vacant'}</p>
        </div>
        {/* </Link> */}
      </div>
    ));
  }, [ordersArr]);

  return (
    <Layout>
      <div className="container">
        <div className="row flex-wrap">{renderedTables}</div>
      </div>
    </Layout>
  );
};

export default Tables;
