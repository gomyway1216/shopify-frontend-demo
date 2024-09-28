import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Checkout from './Checkout';
import Navbar from './Navbar';
import { CartProvider } from './CartProvider';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
