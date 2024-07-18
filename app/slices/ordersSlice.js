import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { generateOrderId } from '../utils/generateOrderId';
// import axios from 'axios';


export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (payload) => {
     const { orderId, tableId } = payload || {};

    let fetchUrl = `/api/orders`;
    if (orderId || tableId) {
        fetchUrl += `?${orderId ? `orderId=${orderId}` : ''}${orderId && tableId ? '&' : ''}${tableId ? `tableId=${tableId}` : ''}`;
    }
    console.log("this is url", fetchUrl);
    try {
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        // console.log("This is data",data);

        if (response.status === 200) {
            // console.log('Orders retrieved successfully', data.orders);
            return data.orders;
        } else {
            console.log('Error retrieving orders', data);
        }
    } catch (error) {
        console.error('Error:', error);
        return error;
    }

});

// export const updateOrder = createAsyncThunk('orders/updateOrder', async (payload) => {
//     const { orderId, tableId } = payload || {};

//    let fetchUrl = `/api/orders`;
//    if (orderId || tableId) {
//        fetchUrl += `?${orderId ? `orderId=${orderId}` : ''}${orderId && tableId ? '&' : ''}${tableId ? `tableId=${tableId}` : ''}`;
//    }
//    console.log("this is url", fetchUrl);
//    try {
//        const response = await fetch(fetchUrl, {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        });

//        const data = await response.json();
//        // console.log("This is data",data);

//        if (response.status === 200) {
//            // console.log('Orders retrieved successfully', data.orders);
//            return data.orders;
//        } else {
//            console.log('Error retrieving orders', data);
//        }
//    } catch (error) {
//        console.error('Error:', error);
//        return error;
//    }

// });


const initialValue = {
    tableId: null,
    orders: [],
};

export const orderSlice = createSlice({
    name: 'orders',
    initialState: initialValue,
    reducers: {
        // handleSearchVal: (state, action) => {
        //     state.searchVal = action.payload;
        // }
        selectTable:(state,action)=>{
            state.tableId = action.payload;
        },
        addOrder: (state, action) => {
            const { tableId, order,total } = action.payload;
            // const tableOrders = state.orders.find(orders => orders.tableId === tableId);
            // if (tableOrders) {
            //     tableOrders.orders.push(order);
            // } else {
                const orderId = generateOrderId(); 
                state.orders.push({ 
                    orderId,
                    tableId, 
                    orders: order,
                    total,
                    status:"Unpaid",
                    date:new Date().toISOString() 
                });
            // }
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        // updateOrder: (state, action) => {
        //     const { tableId, orderId, updatedOrder } = action.payload;
        //     const tableOrders = state.orders.find(orders => orders.tableId === tableId);
        //     if (tableOrders) {
        //         const orderIndex = tableOrders.orders.findIndex(order => order.orderId === orderId);
        //         if (orderIndex >= 0) {
        //             tableOrders.orders[orderIndex] = {
        //                 ...tableOrders.orders[orderIndex],
        //                 ...updatedOrder,
        //             };
        //         }
        //     }
        // }
    },
    extraReducers: builder => {
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
            // console.log("this is ordrs payload",action.payload);
        });
        // builder.addCase(updateOrder.fulfilled, (state, action) => {
        //     state.orders = action.payload;
        //     // console.log("this is ordrs payload",action.payload);
        // });
    }
});

export const { selectTable,addOrder,setOrders } = orderSlice.actions

export default orderSlice.reducer;