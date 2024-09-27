import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/ordersSlice';
import menuReducer from './slices/menuSlice';
import siteSettings from './slices/siteSettingSlice';

const store = configureStore({
    reducer: {
        orderReducer,
        menuReducer,
        siteSettings,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
export default store;