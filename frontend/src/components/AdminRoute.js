
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import AdminLoginPage from '../pages/AdminLoginPage';

const AdminRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <AdminLoginPage />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.user.isAdmin;

    return isAdmin ? children : <AdminLoginPage />;
  } catch (error) {
    console.error('Error decoding token:', error);
    return <AdminLoginPage />;
  }
};

export default AdminRoute;
