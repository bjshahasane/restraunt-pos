import React from 'react';
import Link from 'next/link';


const SideBar = () => {
  return (
   
        <div className="col-auto px-sm-2 px-0 bgGray2">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                {/* <Link href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Menu</span>
                </Link> */}
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <Link href="/pages/tables" className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Tables</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="/pages/menus" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Menus</span></Link>
                    </li>
                   
                    <li>
                        <Link href="/pages/orders" className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Orders</span> </Link>
                    </li>
                </ul>
               
            </div>
        </div>
       
   

  )
}

export default SideBar
