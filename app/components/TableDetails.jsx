import React, { useEffect, useState } from 'react'
import { formatCurrency } from '../utils/generateOrderId';
import { addOrder, fetchOrders } from '../slices/ordersSlice';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { generateOrderId } from '../utils/generateOrderId';

const TableDetails = ({ tableid, orderItems, total, orderId, orderStatus }) => {

    const dispatch = useDispatch();
    const pathname = usePathname();
    const [oStatus, setOStatus] = useState("Unpaid");

    useEffect(() => {
        if (orderStatus) {
            setOStatus(orderStatus)
            console.log("this is orderStatus",orderStatus);
        }
    }, [orderStatus])




    const addUpdateOrder = async () => {
        if (!orderId) {
            const payload = {
                orderId: generateOrderId(),
                tableId: tableid,
                orders: orderItems,
                total,
                date: new Date().toISOString(),
                status: oStatus,
            }
            console.log("This is order payload",payload);
            try {
                const response = await fetch(`/api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                console.log(data);

                if (response.status === 200) {
                    console.log('Order added successfully');
                } else {
                    console.log('Error adding order', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            let updatedData;
            console.log("this is inner status", oStatus);
            if (pathname.includes('orders')) {

                updatedData = {
                    status: oStatus,
                    date: new Date().toISOString(),
                };
            } else {
                updatedData = {
                    tableId: tableid,
                    orders: orderItems,
                    total,
                    date: new Date().toISOString(),
                };

            }

            console.log("this is updated", updatedData);
            try {
                const response = await fetch(`/api/orders/?orderId=${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                const data = await response.json();
                console.log(data);

                if (response.status === 200) {
                    console.log('Order updated successfully');
                    dispatch(fetchOrders());

                    // window.location.reload();

                } else {
                    console.log('Error updating order', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // router.push('/menu');
    };


    console.log("this is staus", oStatus);

    // console.log("This is ordered items",orderItems);
    return (
        <div className='d-flex flex-column justify-content-between col-md-3 border-0 p-4 rounded detail-box mt-3' style={{ height: "90vh", maxWidth: "90vh" }}>
            <div>
                {
                    pathname.includes('orders') && (
                        <div className='d-flex justify-content-end'>
                            <Link href={`/pages/menus/${tableid}/${orderId}`} passHref className="nav-link align-middle px-0">
                                <button type="button" className="btn edit-btn m-3">Edit order</button>
                            </Link>
                        </div>
                    )
                }

                <div className='row'>
                    <h2 className='col'>Table {tableid}</h2>
                    <h6 className='col align-content-center'>{orderId ? `order #${orderId}` : ""}</h6>
                </div>

                <div className='mt-3' style={{ overflowY: "scroll", maxHeight: "40vh", overflowX: "hidden" }}>
                    <table className="table bgWhite2" >
                        <thead>
                            <tr>
                                <th scope="col">Item</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody >
                            {orderItems && orderItems.map(item => (
                                <tr key={item.id}>
                                    <th scope="row">{item.name}</th>
                                    <td>{item.quantity}</td>
                                    <td>{formatCurrency((item.price) * (item.quantity))}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <div >
                <table className='table border-top bgWhite2'>
                    <thead>
                        <tr>
                            <th className='fs-2'>Total</th>
                            <th className='fs-4 align-content-center'>{formatCurrency(total)}</th>
                        </tr>

                        <tr>
                            <td className='border-0'>
                                <select className="form-control dropdown edit-btn" value={oStatus} onChange={(e) => setOStatus(e.target.value)}>
                                    <option value="" disabled>Order Status </option>
                                    <option className='dropdown-item' value="Paid">Paid</option>
                                    <option className='dropdown-item' value="Unpaid">Unpaid</option>
                                </select>
                            </td>
                            <td className='border-0'>
                                <Link href={`/pages/orders`} className="nav-link align-middle px-0">
                                    <button type="button" className="btn mt-3 add-btn" onClick={addUpdateOrder}>{orderId ? "Update Order" : "Add order"}</button>
                                </Link>
                            </td>

                        </tr>



                    </thead>


                </table>
            </div>
        </div>
    )
}

export default TableDetails
