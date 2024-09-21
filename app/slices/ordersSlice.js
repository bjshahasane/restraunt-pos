import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { generateOrderId } from '../utils/generateOrderId';
// import axios from 'axios';


export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (payload) => {
     const { orderId, tableId } = payload || {};
     const token = localStorage.getItem('token');
    let fetchUrl = `/api/orders`;
    if (orderId || tableId) {
        fetchUrl += `?${orderId ? `orderId=${orderId}` : ''}${orderId && tableId ? '&' : ''}${tableId ? `tableId=${tableId}` : ''}`;
    }
    try {
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();
        // console.log("This is data",data);
        if (response.status === 401 || response.status === 403) {
            // Token is invalid or expired
            localStorage.removeItem('token'); // Optionally, clear the token
            window.location.href = '/pages/createUser';  // Redirect to login
          }
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


const initialValue = {
    tableId: null,
    orders: [],
};

export const orderSlice = createSlice({
    name: 'orders',
    initialState: initialValue,
    reducers: {
       
        selectTable:(state,action)=>{
            state.tableId = action.payload;
        },
        addOrder: (state, action) => {
            const { tableId, order,total } = action.payload;
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
        
    },
    extraReducers: builder => {
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
        });
    }
});

export const { selectTable,addOrder,setOrders } = orderSlice.actions

export default orderSlice.reducer;