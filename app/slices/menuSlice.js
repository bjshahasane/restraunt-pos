import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { generateOrderId } from '../utils/generateOrderId';
// import axios from 'axios';


export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (payload) => {
    //  const { orderId, tableId } = payload || {};
    const token = localStorage.getItem('token');
    let fetchUrl = `/api/menu`;

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
            return data.menu;
        } else {
            console.log('Error retrieving orders', data);
        }
    } catch (error) {
        console.error('Error:', error);
        return error;
    }

});



const initialValue = {
    menu: []
};

export const menuSlice = createSlice({
    name: 'menu',
    initialState: initialValue,
    reducers: {
    },
    extraReducers: builder => {
        builder.addCase(fetchMenu.fulfilled, (state, action) => {
            state.menu = action.payload;
        });
    }
});

// export const { selectTable,addOrder,setOrders } = orderSlice.actions

export default menuSlice.reducer;