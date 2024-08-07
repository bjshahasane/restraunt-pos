'use client'

import { useParams } from 'next/navigation';
import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import { useEffect, useState } from 'react';
import MenuInnerDetails from '@/app/components/MenuInnerDetails';
import {categories} from '@/app/js/category';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';

const MenuDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((state)=>state.menuReducer);

  // const router = useRouter();
  // const param = useParams();
  // console.log("these are params",slug);
  let tableid,orderId;
  if (slug && slug.length > 0) {
    tableid = slug[0];
    if (slug.length > 1) {
      orderId = slug[1];
    }
  }
  const [currentMenu,setCurrentMenu] = useState('VegStarters');
  const [filteredMenu,setFilteredMenu] = useState();
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [menuCatlog, setMenuCatlog] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(()=>{
    dispatch(fetchMenu());
  },[])
  

  useEffect(()=>{
    if(store.menu){
      setMenuCatlog(store.menu);
      let cat = store.menu;
      const category = cat.find(cat => cat.categoryName === currentMenu);
      if(category){
        setFilteredMenu(category);
        // console.log("this is ====>>>",category);
        dispatch(fetchOrders({orderId}));
      }
    }
    
  },[store.menu,currentMenu])


  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);
  
  const fetchOrderDetails=(Oid)=>{
  dispatch(fetchOrders(Oid)).then((response) => {
    // setIsLoading(true);
    if (response) {
        const fetchedOrder = response.payload[0];
        const tempOrders = fetchedOrder.orders.reduce((acc, item) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {});
        setOrder(tempOrders);
        setOrderItems(fetchedOrder.orders);
        setTotal(fetchedOrder.total);
        setOrderStatus(fetchedOrder.status) // setIsLoading(false);

    } else {
        console.log("Error occurred while searching book.");
        // setIsLoading(false);
    }
})
    .catch((error) => {
        console.log("Error occurred:", error.message);
        // setIsLoading(false);
    });

}


  const handleMenu = (cname)=> {
    setCurrentMenu(cname);
    // console.log("this is filtered",filteredMenu.options);
  }

  const handleQuantityChange = (id, quantity) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      [id]: quantity,
      tableid,
    }));
    updateOrderItems({ ...order, [id]: quantity });
  };

//   const orderItems = Object.keys(order).map(id => {
//     const category = categories.find(cat => cat.options.find(option => option.id === id));
//     const item = category?.options.find(option => option.id === id);

//     if (item && order[id] > 0) {
//         return { ...item, quantity: order[id] };
//     }
//     return null;
// }).filter(item => item !== null);

// const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

const updateOrderItems = (order) => {
  const temp = Object.keys(order).map(id => {
    const category = menuCatlog.find(cat => cat.options.find(option => option.id === id));
    const item = category?.options.find(option => option.id === id);

    if (item && order[id] > 0) {
      return { ...item, quantity: order[id] };
    }
    return null;
  }).filter(item => item !== null);

  setOrderItems(temp);
  const sum = temp.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  setTotal(sum);
};

//   const addToOrder = () => {
//     dispatch(addOrder({ tableId:tableid, order: orderItems,total }));
//     // router.push('/menu');
// };

  return (
    <Layout>
    <div className='container'>
      <div className="row flex-wrap justify-content-between">
        <div className='row col-md-9'>
          <div className='container'>
            {/* <div className='row justify-content-end'>
            <Link href="/pages/orders" className="nav-link align-middle px-0">
            <button type="button" className="btn btn-primary col-md-3" onClick={()=>addToOrder()}>{orderId ? "Update Order":"Add order"}</button>

            </Link>
            </div> */}
            <div className='row'>
            {
            menuCatlog && menuCatlog.map((item) => (
              <div key={item.id} className={`card col-md-2 m-2 menu-card  ${currentMenu == item.categoryName ?"selected":"border-0"}`} onClick={()=>handleMenu(item.categoryName)}>
                  <div className="card-body p-1">
                    {/* <h6 className="card-title fs-9"> {item.displayName}</h6> */}
                    <p className='fs-9 m-0'>{item.displayName}</p>
                  </div>
              </div>
            ))
          }
            </div>
            <hr/>
            <div className='row'>
          
          {
            filteredMenu && filteredMenu?.options.length > 0 && filteredMenu?.options.map((option)=>(
              <MenuInnerDetails key={option.id} option={option} handleQuantityChange={handleQuantityChange} initialQuantity={order[option.id] || 0}/>
            ))
          }
            </div>
          </div>
       
          
        </div>
        <TableDetails tableid={tableid} orderItems={orderItems} total={total} orderId={orderId} orderStatus={orderStatus}/>
      </div>
      
    </div>
   
  </Layout>
  );
};

export default MenuDetails;

// export async function getServerSideProps({context}) {
//     // Fetch table data from an API or database
//     // const res = await fetch('https://your-api-endpoint/tables');
//     // const tables = await res.json();
  
//     // return {
//     //   props
//     // };
//     console.log("this is context",context);
//   }