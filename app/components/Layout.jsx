import React from 'react';
import SideBar from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const Layout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // You can choose light or dark theme as well
        /> */}
        <SideBar />
        <div className='col py-3'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
