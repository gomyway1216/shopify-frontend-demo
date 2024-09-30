import React, { useContext, useState } from 'react';
import { CartContext } from './CartProvider';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { carts, clearCart } = useContext(CartContext); // Access clearCart from context
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate hook for programmatic navigation

  const toggleCartDialog = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  // Helper function to aggregate cart items and count quantities
  const aggregateCartItems = () => {
    const itemsMap = {};
    let totalCartCount = 0;
    let totalPrice = 0;

    Object.values(carts).forEach(cart => {
        if(!cart.lines || cart.lines.length === 0) {
            return;
        }
      cart.lines?.edges.forEach(({ node }) => {
        const productId = node.merchandise.product.id;
        const productTitle = node.merchandise.product.title;
        const quantity = node.quantity;
        const price = parseFloat(node.merchandise.product.priceRange.minVariantPrice.amount);

        totalPrice += price * quantity;

        if (itemsMap[productId]) {
          itemsMap[productId].quantity += quantity;
        } else {
          itemsMap[productId] = {
            title: productTitle,
            quantity,
            price,
          };
        }

        totalCartCount += quantity;
      });
    });

    return { itemsMap, totalCartCount, totalPrice };
  };

  const { itemsMap, totalCartCount, totalPrice } = aggregateCartItems();

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-lg">My Shop</div>
      <button
        onClick={toggleCartDialog}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Cart ({totalCartCount})
      </button>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
            {totalCartCount > 0 ? (
              <>
                <ul className="list-disc pl-6">
                  {Object.values(itemsMap).map((item, index) => (
                    <li key={index} className="mb-1">
                      {item.title} - Price: ${item.price.toFixed(2)} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p className="text-lg font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
                </div>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleCartDialog}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Close
              </button>
              <button
                onClick={handleCheckout}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Go to Checkout
              </button>
              <button
                onClick={clearCart} // Trigger clearCart function to clear the cart
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
