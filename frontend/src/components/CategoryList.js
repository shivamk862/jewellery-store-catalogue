
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Shop by Category</h2>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {categories.map((category) => (
            <Col key={category._id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3 rounded text-center">
                <Link to={`/products?category=${category._id}`}>
                  <Card.Img src={category.imageBase64} variant="top" />
                  <Card.Body>
                    <Card.Title as="div">
                      <strong>{category.name}</strong>
                    </Card.Title>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CategoryList;
