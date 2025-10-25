
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);

  const getCart = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('/api/cart', config);
      setCart(res.data);
    } catch (err) {
      setError(err.response ? err.response.data.msg : err.message);
    }
    setLoading(false);
  };

  const addToCart = async (productId, quantity) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const body = JSON.stringify({ productId, quantity });
      const res = await axios.post('/api/cart', body, config);
      setCart(res.data);
      toast.success('Item added to cart!');
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.delete(`/api/cart/${productId}`, config);
      setCart(res.data);
      toast.success('Item removed from cart!');
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <CartContext.Provider value={{ cart, loading, error, getCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
