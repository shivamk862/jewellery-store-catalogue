import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import HeroImage from '../assets/pexels-pixabay-265906.jpg'; // Assuming the image is in src/assets
import CategoryList from '../components/CategoryList';

const HomePage = () => {
  const heroStyle = {
    backgroundImage: `url(${HeroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    flexDirection: 'column',
  };

  return (
    <>
      <div style={heroStyle}>
        <h1 className="display-3" style={{ fontWeight: 'bold' }}>Exquisite Jewellery for Every Occasion</h1>
        <p className="lead">Discover our stunning collection of handcrafted jewellery.</p>
        <Link to="/products">
          <Button variant="light" size="lg">Shop Now</Button>
        </Link>
      </div>
      <div className="my-5 category-list-container">
        <CategoryList />
      </div>
    </>
  );
};

export default HomePage;