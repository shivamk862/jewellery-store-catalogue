import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
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

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Jewellery Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/products">
                Products
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                <i className="fas fa-shopping-cart"></i> Cart
                {cart.items.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                    {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {isAuthenticated ? (
                <Nav.Link onClick={onLogout} href="#!">
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link onClick={handleShowModal} href="#!">
                  Login/Signup
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginSignupModal show={showModal} handleClose={handleCloseModal} />
    </>
  );
};

export default Header;