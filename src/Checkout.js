import React, { useState } from 'react';
import axios from 'axios';
import { getServerUrl } from './apiRouter';

const Checkout = ({ carts }) => {
  const [buyerIdentity, setBuyerIdentity] = useState({
    email: '',
    phone: '',
    countryCode: '',
    deliveryMethod: '',
    pickupHandle: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyerIdentity(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateBuyerIdentity = async (cartId, shopName) => {
    try {
      const response = await axios.post(getServerUrl('updateCartBuyerIdentity'), {
        shopName,
        cartId,
        buyerIdentity: {
          email: buyerIdentity.email,
          phone: buyerIdentity.phone,
          countryCode: buyerIdentity.countryCode,
          preferences: {
            delivery: {
              deliveryMethod: buyerIdentity.deliveryMethod,
              pickupHandle: buyerIdentity.pickupHandle,
            }
          }
        }
      });

      console.log('Buyer Identity Update Response:', response);
      alert('Buyer identity updated successfully!');
    } catch (error) {
      console.error('Error updating buyer identity:', error);
      alert('Error updating buyer identity');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Display cart items */}
      {Object.entries(carts).map(([shopName, shopCart]) => (
        <div key={shopName} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{shopName}</h3>
          <ul className="list-disc pl-6">
            {shopCart.lines?.edges?.map(({ node }) => (
              <li key={node.id} className="mb-1">
                {node.merchandise.product.title} - Price: ${node.merchandise.product.priceRange.minVariantPrice.amount} - Quantity: {node.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Buyer Identity Form */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Buyer Information</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={buyerIdentity.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={buyerIdentity.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country Code</label>
            <input
              type="text"
              name="countryCode"
              value={buyerIdentity.countryCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Delivery Method</label>
            <input
              type="text"
              name="deliveryMethod"
              value={buyerIdentity.deliveryMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Pickup Handle</label>
            <input
              type="text"
              name="pickupHandle"
              value={buyerIdentity.pickupHandle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </form>
        
        {/* Update Buyer Identity Button */}
        {Object.entries(carts).map(([shopName, shopCart]) => (
          <button
            key={shopCart.id}
            onClick={() => handleUpdateBuyerIdentity(shopCart.id, shopName)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Update Buyer Identity for {shopName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
