import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type Order = {
  id: number;
  name: string;
  price: number;
};

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderName, setOrderName] = useState('');
  const [orderPrice, setOrderPrice] = useState<number | string>('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const getTotalPrice = () => {
    return orders.reduce((total, order) => {
      const price = typeof order.price === 'number' ? order.price : parseFloat(order.price as any) || 0;
      return total + price;
    }, 0);
  };
   

  const saveOrder = () => {
    if (orderName && orderPrice) {
      const newOrder: Order = {
        id: Date.now(),
        name: orderName,
        price: parseFloat(orderPrice as string) || 0,
      };

      if (editingOrder) {
        axios.put(`http://localhost:5000/api/orders/${editingOrder.id}`, newOrder)
          .then(response => {
            setOrders(orders.map(order => order.id === editingOrder.id ? response.data : order));
            setEditingOrder(null);
            setOrderName('');
            setOrderPrice('');
          })
          .catch(error => console.error('Error updating order:', error));
      } else {
        axios.post('http://localhost:5000/api/orders', newOrder)
          .then(response => {
            setOrders([...orders, response.data]);
            setOrderName('');
            setOrderPrice('');
          })
          .catch(error => console.error('Error adding order:', error));
      }
    }
  };

  const deleteOrder = (orderId: number) => {
    axios.delete(`http://localhost:5000/api/orders/${orderId}`)
      .then(() => {
        setOrders(orders.filter(order => order.id !== orderId));
      })
      .catch(error => console.error('Error deleting order:', error));
  };

  return (
    
    <div className="container">
       <nav className="navbar">
        <div className="logo">
          {/* Logo inside navbar */}
          <a href="index.html">
            <img src="/Logo Coffee Shop-01.png" alt="Es.Co Logo" /> {/* Reference logo from the 'public' folder */}
          </a>
          <span>Es.Co</span>
        </div>
        <ul className="nav-links">
          <li><a href="home.html">Home</a></li>
          <li><a href="stocks.html">Stock</a></li>
        </ul>
      </nav>
      <h1>Es.Co Coffee Shop Order</h1>
      <div className="order-form">
        <input
          type="text"
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
          placeholder="Enter Coffee Name"
        />
        <input
          type="number"
          value={orderPrice}
          onChange={(e) => setOrderPrice(e.target.value)}
          placeholder="Enter Price"
        />
        <button onClick={saveOrder}>
          {editingOrder ? 'Update Order' : 'Add Order'}
        </button>
      </div>

      <h2>Order List</h2>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.name}</td>
              <td>{formatPrice(order.price)}</td>
              <td>
                <button onClick={() => setEditingOrder(order)}>Edit</button>
                <button onClick={() => deleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Price: {formatPrice(getTotalPrice())}
      </h3>
    </div>
  );
}

export default App;
