
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Button, Row, Col, Image, Card } from 'react-bootstrap';
import CartContext from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleBuy = () => {
    alert('Thank you for your purchase!');
    // Here you would typically redirect to a checkout page or process the payment
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cart.items.length === 0 ? (
          <p>Your cart is empty. <Link to="/products">Go shopping</Link></p>
        ) : (
          <ListGroup variant="flush">
            {cart.items.map((item) => (
              <ListGroup.Item key={item.product._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.product.imageBase64} alt={item.product.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                  </Col>
                  <Col md={2}>${item.product.price}</Col>
                  <Col md={2}>{item.quantity}</Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => handleRemoveFromCart(item.product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)}) items
              </h2>
              $
              {cart.items
                .reduce((acc, item) => acc + item.quantity * item.product.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.items.length === 0}
                onClick={handleBuy}
              >
                Proceed to Buy
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
