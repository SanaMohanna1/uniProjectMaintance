import React, { useState, useEffect } from 'react';
import './YourOrders.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ShowDetailsModal } from './ShowDetailsModal';

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rowToshow, setRowToshow] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3002/orders`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 401 || data.status === false) {
        setAuthError(true);
        toast.warning(data.message || "Please log in to view your orders.");
        return;
      }

      setOrders(data.orders || data); // support both { orders: [...] } and direct array
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders.");
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewClick = (orderId) => {
    const order = orders.find((row) => row.id === orderId);
    if (order) {
      setIsDetailsModalOpen(true);
      setCurrentOrderId(order.id);
      setRowToshow(order);
    } else {
      console.error("Order not found for ID:", orderId);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  if (authError) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🔐 Please log in to view your orders.</h2>
        <a
          href="/login"
          style={{
            marginTop: "20px",
            display: "inline-block",
            fontSize: "18px",
            color: "#007bff",
            textDecoration: "underline",
          }}
        >
          👉 Login here
        </a>
      </div>
    );
  }

  return (
    <div className='yourorders'>
      <h1 className='mainhead1'>Your Orders</h1>
      <table className='yourorderstable'>
        <thead>
          <tr>
            <th scope='col'>Order ID</th>
            <th scope='col'>Status</th>
            <th scope='col'>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr key={index}>
              <td data-label='OrderID'>{item.id}</td>
              <td data-label='Delivery Status'>
                <div>
                  {item.status === 'Delivered' && <span className='greendot'></span>}
                  {item.status === 'On the way' && <span className='yellowdot'></span>}
                  {item.status === 'Cancelled' && <span className='reddot'></span>}
                  {item.status}
                </div>
              </td>
              <td data-label='Invoice'>
                <button className='mainbutton1' onClick={() => handleViewClick(item.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDetailsModalOpen && (
        <ShowDetailsModal
          closeModal={() => {
            setIsDetailsModalOpen(false);
            setCurrentOrderId(null);
            setRowToshow(null);
          }}
          defaultValue={orders.find((row) => row.id === currentOrderId) || {}}
          orderId={currentOrderId}
        />
      )}
    </div>
  );
};

export default YourOrders;
