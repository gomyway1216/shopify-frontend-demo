import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from './CartProvider';
import { getServerUrl } from './apiRouter';

const Checkout = () => {
  const { carts, fetchCartInfo } = useContext(CartContext);// Use CartContext to get carts
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
      // Update Buyer Identity
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

      if (response.status >= 200 && response.status < 300) {
        console.log('Buyer identity updated successfully!');

        // Now call getCheckoutURL to get the checkout URL
        const checkoutResponse = await axios.get(getServerUrl('getCheckoutURL'), {
          params: { shopName, cartId }
        });

        const checkoutUrl = checkoutResponse.data.data.cart.checkoutUrl;
        console.log('Checkout URL:', checkoutUrl);

        // Redirect the user to the checkout URL
        window.location.href = checkoutUrl;
      } else {
        alert('Error updating buyer identity. Please try again.');
      }
    } catch (error) {
      console.error('Error updating buyer identity or getting checkout URL:', error);
      alert('Error processing request. Please try again.');
    }
  };

  // Aggregate the cart items similar to what we did in Navbar
  const aggregateCartItems = () => {
    const itemsMap = {};
    let totalPrice = 0;

    console.log('carts', carts);

    Object.values(carts).forEach(cart => {
      cart.lines?.edges.forEach(({ node }) => {
        const productId = node.merchandise.product.id;
        const productVariantId = node.merchandise.id;
        const lineId = node.id;
        const cartId = cart.id;
        const shopName = cart.shopName;
        const productTitle = node.merchandise.product.title;
        const quantity = node.quantity;
        const price = parseFloat(node.merchandise.product.priceRange.minVariantPrice.amount);

        totalPrice += price * quantity;

        // Aggregate items by productId
        if (itemsMap[productId]) {
          itemsMap[productId].quantity += quantity;
        } else {
          itemsMap[productId] = {
            productId,
            productVariantId,
            shopName,
            lineId,
            cartId,
            title: productTitle,
            quantity,
            price,
          };
        }
      });
    });

    return { itemsMap, totalPrice };
  };

  const handleRemoveItem = async (shopName, cartId, lineId) => {
    console.log('handleRemoveItem', shopName, cartId, lineId);
    try {
      const response = await axios.post(getServerUrl('removeCartLines'), {
        shopName,
        cartId,
        lineIds: [lineId]
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Item removed successfully!');
        // Update the local cart state
        await fetchCartInfo(shopName, cartId);
      } else {
        alert('Error removing item from cart. Please try again.');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleClearCart = async () => {
    try {
      for (const [shopName, cart] of Object.entries(carts)) {
        const response = await axios.post(getServerUrl('clearCart'), {
          shopName,
          cartId: cart.id
        });

        if (response.status >= 200 && response.status < 300) {
          console.log(`Cart cleared successfully for ${shopName}!`);
          // Update the local cart state
          await fetchCartInfo(shopName, cart.id);
        } else {
          console.error(`Error clearing cart for ${shopName}`);
        }
      }
      alert('All carts have been cleared.');
    } catch (error) {
      console.error('Error clearing carts:', error);
      alert('Error clearing carts. Please try again.');
    }
  };

  const { itemsMap, totalPrice } = aggregateCartItems();

  console.log('itemsMap', itemsMap);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Display cart items */}
      {Object.keys(itemsMap).length > 0 ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Cart</h3>
          <ul className="list-none pl-0">
            {Object.entries(itemsMap).map(([lineId, item]) => (
              <li key={lineId} className="mb-2 flex justify-between items-center">
                <span>
                  {item.title} - Price: ${item.price.toFixed(2)} - Quantity: {item.quantity}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.shopName, item.cartId, item.lineId)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-4"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
            >
              Clear All Carts
            </button>
          </div>
          <div className="mt-4">
            <p className="text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}

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
            <select
              name="countryCode"
              value={buyerIdentity.countryCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Country Code</option>
              {["AF", "AX", "AL", "DZ", "AD", "AO", "AI", "AG", "AR", "AM", "AW", "AC", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "KH", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CI", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MQ", "MR", "MU", "YT", "MX", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "AN", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "NO", "OM", "PK", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "QA", "CM", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "VC", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TA", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "WF", "EH", "YE", "ZM", "ZW", "ZZ"].map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Delivery Method</label>
            <select
              name="deliveryMethod"
              value={buyerIdentity.deliveryMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Delivery Method</option>
              {["SHIPPING", "PICK_UP", "PICKUP_POINT"].map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
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

        {/* Proceed to Checkout Button */}
        {Object.entries(carts).map(([shopName, shopCart]) => (
          <button
            key={shopCart.id}
            onClick={() => handleUpdateBuyerIdentity(shopCart.id, shopName)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Proceed to Checkout for {shopName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Checkout;

