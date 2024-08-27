'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { selectTable, fetchOrders } from '../../slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';

const Tables = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.orderReducer);
  const [ordersArr, setOrdersArr] = useState([]);

  const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (store.orders) {
      setOrdersArr(store.orders);
    }
  }, [store.orders]);

  const isTableUnpaid = (tableId) => {
    return ordersArr.some((order) => order.tableId === tableId && order.status === 'Unpaid');
  };

  const renderedTables = useMemo(() => {
    return tableNumbers.map((tableId) => (
      <div
        key={tableId}
        className={`card col-sm-5 col-md-2 m-2 table-card border-0 ${
          isTableUnpaid(String(tableId)) ? 'disabled-link' : ''
        }`}
      >
        <Link href={`/pages/menus/${tableId}`} onClick={() => dispatch(selectTable(tableId))}>
          <div className="card-body">
            <h5 className="card-title">Table {tableId}</h5>
            <p className="card-text">{isTableUnpaid(String(tableId)) ? 'Occupied' : 'Vacant'}</p>
          </div>
        </Link>
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
