import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import LoginSignupModal from './LoginSignupModal';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <li className="nav-item">
      <a onClick={onLogout} href="#!" className="nav-link">
        Logout
      </a>
    </li>
  );

  const guestLinks = (
    <li className="nav-item">
      <a href="#!" className="nav-link" onClick={handleShowModal}>
        Login/Signup
      </a>
    </li>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Jewellery Store
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  <i className="fas fa-shopping-cart"></i> Cart
                  {cart.items.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </li>
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
      <LoginSignupModal show={showModal} handleClose={handleCloseModal} />
    </>
  );
};

export default Header;