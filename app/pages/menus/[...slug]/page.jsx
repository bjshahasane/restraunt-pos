'use client';

import { useParams, useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';
import TableDetails from '@/app/components/TableDetails';
import MenuInnerDetails from '@/app/components/MenuInnerDetails';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/slices/ordersSlice';
import { fetchMenu } from '@/app/slices/menuSlice';

const MenuDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { menu } = useSelector((state) => state.menuReducer);
  const { orders } = useSelector((state) => state.orderReducer);

  const [currentMenu, setCurrentMenu] = useState('VegStarters');
  const [order, setOrder] = useState({});
  const [loginToken, setLoginToken] = useState(null);
  const [orderObj, setOrderObj] = useState({});

  const tableId = slug?.[0];
  const orderId = slug?.[1];

  // Fetch menu and orders on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
    if (!token) {
      router.push('/pages/createUser');
      return;
    }
    setLoginToken(token);

    dispatch(fetchMenu());
    if (orderId) {
      dispatch(fetchOrders({ orderId, tableId }));
    }
  }, [dispatch, orderId, tableId, router]);

  // Update the order state when orders change
  useEffect(() => {
    if (orders?.orders?.[0] && orderId) {
      const fetchedOrder = orders.orders[0];
      const tempOrders = fetchedOrder.orders.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});

      setOrder(tempOrders);
      setOrderObj({
        ...fetchedOrder,
        orderItems:fetchedOrder.orders,
        tableid:tableId,
        orderId,
      });
    }
  }, [orders, tableId, orderId]);

  // Update order items when menu or order changes
  useEffect(() => {
    if (menu) {
      updateOrderItems();
    }
  }, [menu, currentMenu]);

  // Memoize the current menu category options to avoid recalculating
  const currentMenuOptions = useMemo(() => {
    return menu?.find((cat) => cat.categoryName === currentMenu)?.options || [];
  }, [menu, currentMenu]);

  // Handle category switch
  const handleMenu = (categoryName) => {
    setCurrentMenu(categoryName);
  };

  // Handle quantity changes for items
  const handleQuantityChange = (id, quantity) => {
    const updatedOrder = { ...order, [id]: quantity };
    setOrder(updatedOrder);
    updateOrderItems(updatedOrder);
  };

  // Update the order object with the latest order items and total
  const updateOrderItems = (uOrder = order) => {
    const updatedItems = Object.keys(uOrder)
      .map((id) => {
        const category = menu?.find((cat) =>
          cat.options.find((option) => option.id === id)
        );
        const item = category?.options.find((option) => option.id === id);
        return item && uOrder[id] > 0 ? { ...item, quantity: uOrder[id] } : null;
      })
      .filter(Boolean);

    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setOrderObj((prev) => ({
      ...prev,
      tableid:tableId,
      orderItems: updatedItems,
      total: updatedTotal,
    }));
  };

  console.log("This is orders OBJ in menu",orderObj);
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
                      className={`card col-md-2 m-2 menu-card ${
                        currentMenu === item.categoryName
                          ? 'selected'
                          : 'border-0'
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
                {currentMenuOptions.map((option) => (
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
          <TableDetails
            orderObj={orderObj}
            handleQuantityChange={handleQuantityChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MenuDetails;
