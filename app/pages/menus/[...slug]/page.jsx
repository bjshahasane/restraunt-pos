'use client';

import { useParams,useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import MenuInnerDetails from '@/app/components/MenuInnerDetails';
import { useEffect, useState, useMemo, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';
import { hideLoader, showLoader } from '@/app/slices/siteSettingSlice';

const MenuDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { menu } = useSelector((state) => state.menuReducer);

  const [currentMenu, setCurrentMenu] = useState('VegStarters');
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderStatus, setOrderStatus] = useState('');
  const [loginToken, setLoginToken] = useState();



  const tableId = slug?.[0];
  const orderId = slug?.[1];


  // Fetch the menu and orders on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    if (!token) {
      // Redirect to login if no token is found
      router.push('/pages/createUser');
      return;
    } else {
      setLoginToken(token);
    }
    dispatch(fetchMenu());
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId,dispatch,router]);

  // Update the filtered menu and fetch orders when the menu or currentMenu changes
  useEffect(() => {
    if (menu) {
      const category = menu.find((cat) => cat.categoryName === currentMenu);
      if (category) {
        dispatch(fetchOrders({ orderId }));
        updateOrderItems(order);
      }
    }
  }, [menu, currentMenu, order, orderId, dispatch]);

  const fetchOrderDetails = async (Oid) => {
    dispatch(showLoader(true));
    try {
      const response = await dispatch(fetchOrders(Oid)).unwrap();
      dispatch(hideLoader(true));
      const fetchedOrder = response[0];
      const tempOrders = fetchedOrder.orders.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
      setOrder(tempOrders);
      setOrderItems(fetchedOrder.orders);
      setTotal(fetchedOrder.total);
      setOrderStatus(fetchedOrder.status);
    } catch (error) {
      dispatch(hideLoader(true));
      console.error("Error occurred:", error.message);
    }
  };



  const handleMenu = (categoryName) => {
    setCurrentMenu(categoryName);
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedOrder = {
      ...order,
      [id]: quantity,
      tableId,
    };
    setOrder(updatedOrder);
    updateOrderItems(updatedOrder);
  };

  const updateOrderItems = (order) => {
    const updatedItems = Object.keys(order)
      .map((id) => {
        const category = menu?.find((cat) => cat.options.find((option) => option.id === id));
        const item = category?.options.find((option) => option.id === id);

        return item && order[id] > 0 ? { ...item, quantity: order[id] } : null;
      })
      .filter(Boolean);

    setOrderItems(updatedItems);

    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(updatedTotal);
  };

  return (
    <Layout>
      <div className="container">
        <div className="row flex-wrap justify-content-between">
          <div className="row col-md-9">
            <div className="container">
              <div className="row">
                {menu &&
                  menu.map((item) => (
                    <div
                      key={item.id}
                      className={`card col-md-2 m-2 menu-card ${currentMenu === item.categoryName ? 'selected' : 'border-0'
                        }`}
                      onClick={() => handleMenu(item.categoryName)}
                    >
                      <div className="card-body p-1">
                        <p className="fs-9 m-0">{item.displayName}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <hr />
              <div className="row">
                {menu
                  ?.find((cat) => cat.categoryName === currentMenu)
                  ?.options.map((option) => (
                    <MenuInnerDetails
                      key={option.id}
                      option={option}
                      handleQuantityChange={handleQuantityChange}
                      initialQuantity={order[option.id] || 0}
                    />
                  ))}
              </div>
            </div>
          </div>
          <TableDetails tableid={tableId} orderItems={orderItems} total={total} orderId={orderId} orderStatus={orderStatus} handleQuantityChange={handleQuantityChange}/>
        </div>
      </div>
    </Layout>
  );
};

export default MenuDetails;
