import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Tab, Tabs, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  });

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', image: null });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (err) {
      setError('Error fetching categories');
    }
  };

  // Product Handlers
  const handleShowProductModal = (product) => {
    setIsEditingProduct(!!product);
    setCurrentProduct(product);
    setProductFormData(product ? { ...product, category: product.category._id, image: null } : { name: '', description: '', price: '', category: '', stock: '', image: null });
    setShowProductModal(true);
  };
  const handleCloseProductModal = () => setShowProductModal(false);
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    setProductFormData({ ...productFormData, [name]: files ? files[0] : value });
  };
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const productData = new FormData();
    for (const key in productFormData) {
      productData.append(key, productFormData[key]);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      if (isEditingProduct) {
        await axios.put(`/api/products/${currentProduct._id}`, productData, config);
      } else {
        await axios.post('/api/products', productData, config);
      }
      fetchProducts();
      handleCloseProductModal();
    } catch (err) {
      setError('Error saving product');
    }
    setLoading(false);
  };
  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        setError('Error deleting product');
      }
    }
  };

  // Category Handlers
  const handleShowCategoryModal = (category) => {
    setIsEditingCategory(!!category);
    setCurrentCategory(category);
    setCategoryFormData(category ? { ...category, image: null } : { name: '', image: null });
    setShowCategoryModal(true);
  };
  const handleCloseCategoryModal = () => setShowCategoryModal(false);
  const handleCategoryChange = (e) => {
    const { name, value, files } = e.target;
    setCategoryFormData({ ...categoryFormData, [name]: files ? files[0] : value });
  };
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const categoryData = new FormData();
    categoryData.append('name', categoryFormData.name);
    if (categoryFormData.image) {
      categoryData.append('image', categoryFormData.image);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      if (isEditingCategory) {
        await axios.put(`/api/categories/${currentCategory._id}`, categoryData, config);
      } else {
        await axios.post('/api/categories', categoryData, config);
      }
      fetchCategories();
      handleCloseCategoryModal();
    } catch (err) {
      setError('Error saving category');
    }
    setLoading(false);
  };
  const handleCategoryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        await axios.delete(`/api/categories/${id}`, config);
        fetchCategories();
      } catch (err) {
        setError('Error deleting category');
      }
    }
  };


  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Tabs defaultActiveKey="products" id="admin-dashboard-tabs">
        <Tab eventKey="products" title="Products">
          <Button className="my-3" onClick={() => handleShowProductModal(null)}>
            <i className="fas fa-plus"></i> Add Product
          </Button>
          {loading ? <Spinner animation="border" /> : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>STOCK</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category ? product.category.name : ''}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Button variant="light" className="btn-sm" onClick={() => handleShowProductModal(product)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="danger" className="btn-sm" onClick={() => handleProductDelete(product._id)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        <Tab eventKey="categories" title="Categories">
          <Button className="my-3" onClick={() => handleShowCategoryModal(null)}>
            <i className="fas fa-plus"></i> Add Category
          </Button>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>
                    <Button variant="light" className="btn-sm" onClick={() => handleShowCategoryModal(category)}>
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button variant="danger" className="btn-sm" onClick={() => handleCategoryDelete(category._id)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditingCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCategorySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={categoryFormData.name} onChange={handleCategoryChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleCategoryChange} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={handleCloseProductModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProductSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={productFormData.name} onChange={handleProductChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={productFormData.description} onChange={handleProductChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={productFormData.price} onChange={handleProductChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category" value={productFormData.category} onChange={handleProductChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={productFormData.stock} onChange={handleProductChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleProductChange} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;