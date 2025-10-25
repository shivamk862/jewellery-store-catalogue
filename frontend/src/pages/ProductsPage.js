import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');

        let url = '/api/products';
        const params = {};

        if (category) {
          params.category = category;
        }
        if (searchKeyword) {
          params.search = searchKeyword;
        }

        const { data } = await axios.get(url, { params });
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, searchKeyword]);

  const handleAddToCart = (productId) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your cart.');
      return;
    }
    addToCart(productId, 1);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
  };

  return (
    <div>
      <h1>Products</h1>
      <Form className="mb-3">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={handleSearchChange}
          ></Form.Control>
          {searchKeyword && (
            <Button variant="outline-secondary" onClick={handleClearSearch}>
              <i className="fas fa-times"></i>
            </Button>
          )}
        </InputGroup>
      </Form>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {products.length === 0 ? (
            <Alert variant="info">No products at the store currently. Please request admin to add the products.</Alert>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Card className="my-3 p-3 rounded product-card">
                    <Link to={`/products/${product._id}`}>
                      <Card.Img src={product.imageBase64} variant="top" />
                      <Card.Body>
                        <Card.Title as="div">
                          <strong>{product.name}</strong>
                        </Card.Title>
                        <Card.Text as="div">{product.description}</Card.Text>
                        <Card.Text as="h3">${product.price}</Card.Text>
                      </Card.Body>
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product._id)}
                      className='btn-block'
                      type='button'
                      disabled={product.stock === 0 || !isAuthenticated || cartLoading}
                    >
                      {cartLoading ? <Spinner animation="border" size="sm" /> : 'Add To Cart'}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;