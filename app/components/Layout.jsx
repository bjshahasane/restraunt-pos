import React from 'react';
import SideBar from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
import TriggerNotification from './toaster-msg';



const Layout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
       
        <SideBar />
        <Loader/>
        <TriggerNotification/>
        <div className='col py-3'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
