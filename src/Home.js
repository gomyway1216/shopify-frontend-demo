import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartProvider';
import axios from 'axios';
import { getServerUrl } from './apiRouter';

const Home = () => {
    const { addToCart } = useContext(CartContext); // Get addToCart from context
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [cacheKey, setCacheKey] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(true);
  
    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
          const response = await axios.get(getServerUrl('getAllProducts'), {
            params: { cursor, cacheKey }
          });
          setProducts(prevProducts => [...prevProducts, ...response.data.products]);
          setCursor(response.data.pageInfo.endCursor);
          setCacheKey(response.data.cacheKey);
          setHasNextPage(response.data.pageInfo.hasNextPage);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

 return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-Vendor Shopify Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map(product => (
          <div key={product.node.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">{product.node.title}</h3>
            <p className="mb-2">Store: {product.node.vendor}</p>
            <p className="mb-2">Price: ${product.node.priceRange.minVariantPrice.amount}</p>
            {product.node.images.edges[0] && (
              <img
                src={product.node.images.edges[0].node.originalSrc}
                alt={product.node.title}
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <button
              onClick={() => addToCart(product.node)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={fetchProducts}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-6"
        >
          Load More Products
        </button>
      )}

      <Link
        to="/checkout"
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default Home;