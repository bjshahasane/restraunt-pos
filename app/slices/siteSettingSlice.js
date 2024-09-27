
import { createSlice } from '@reduxjs/toolkit'


const notification_initialState =  {
  notify: false,
  type: 'success',
  message: ''
};

export const siteSettingsSlice = createSlice({
  name: 'sitesettings',
  initialState: {
    notification: notification_initialState,
    loader: {
      show: false,
      counter: 0
    },
    keycloak: {
      token: '',
      timestamp: null,
      expires_in: 0
    }
  },
  reducers: {
    showNotification: (state, action) => {
      const tempNotification = {...state.notification};
      tempNotification.notify = true;
      tempNotification.message = action.payload.message;
      if ('type' in action.payload) {
        tempNotification.type = action.payload.type;
      }
      state.notification = tempNotification;
    },
    clearNotification: (state) => {
      state.notification = notification_initialState;
    },
    showLoader: (state) => {
      state.loader.show = true;
      state.loader.counter += 1; // Increment counter when loader is shown
    },
    hideLoader: (state) => {
      if (state.loader.counter > 0) {
        state.loader.counter -= 1; // Decrement counter when loader is hidden
      }
      if (state.loader.counter === 0) {
        state.loader.show = false; // Hide loader only when counter is zero
      }
    },
    
  },
 
})
export const { showNotification, clearNotification, showLoader, hideLoader, getToken } = siteSettingsSlice.actions;

export default siteSettingsSlice.reducer

