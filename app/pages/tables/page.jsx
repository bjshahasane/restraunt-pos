'use client'

import React, { useEffect,useState } from 'react'
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useDispatch,useSelector } from 'react-redux';
import { selectTable } from '../../slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';
import { fetchOrders } from '../../slices/ordersSlice';

const Tables = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.orderReducer);
  const [ordersArr, setOrdersArr] = useState([])

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  useEffect(() => {
    if (store.orders) {
        setOrdersArr(store.orders);
    }
}, [store])

  useEffect(()=>{
    dispatch(fetchMenu());
    dispatch(fetchOrders());

  },[])
  
  const isTableUnpaid = (tableId) => {
    return ordersArr.some(order => order.tableId === tableId && order.status === "Unpaid");
  }

  return (
    <Layout>
      <div className='container'>
        <div className="row flex-wrap">
          {
            arr && arr.map((item, index) => (
              // <div className="col-md-2">
              //   Table {item}
              // </div>

              <div key={index} className="card col-sm-5 col-md-2 m-2 table-card border-0">
                <Link href={`/pages/menus/${item}`} onClick={() => dispatch(selectTable(item))} className={isTableUnpaid(String(item)) ? 'disabled-link' : ''}>
                  <div className="card-body">
                    <h5 className="card-title">Table {item}</h5>
                    {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a> */}
                    <p className="card-text"></p>

                  </div>
                </Link>
              </div>


            ))
          }

        </div>
      </div>
    </Layout>

  )
}

export default Tables
