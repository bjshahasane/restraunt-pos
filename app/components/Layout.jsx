import React from 'react';
import SideBar from './SideBar';
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';


const Layout = ({children}) => {
  return (
    <div className="container-fluid">
        <div className="row flex-nowrap">
          <SideBar />
          <div className='col py-3'>
            {children}
          </div>
        </div>
      </div>
  )
}

export default Layout
