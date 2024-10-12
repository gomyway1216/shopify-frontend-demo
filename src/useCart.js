import { useState, useEffect } from 'react';
import axios from 'axios';
import { getServerUrl } from './apiRouter';

export const useCart = () => {
  const [carts, setCarts] = useState({});
  const [cartId, setCartId] = useState(localStorage.getItem('cartId'));
  const [shopName, setShopName] = useState(localStorage.getItem('shopName'));

  console.log('carts in useCart', carts, 'cartId', cartId);

  useEffect(() => {
    if (cartId && shopName) {
      fetchCartInfo(shopName, cartId);
    }
  }, [cartId, shopName]);

  const fetchCartInfo = async (shopName, cartId) => {
    try {
      const response = await axios.get(getServerUrl('getCartInfo'), {
        params: { shopName, cartId }
      });
      console.log('fetchCartInfo response', response);
      setCarts(prevCarts => ({
        ...prevCarts,
        [shopName]: response.data.data.cart
      }));
    } catch (error) {
      console.error('Error fetching cart info:', error);
    }
  };

  const createCart = async (shopName) => {
    try {
      const response = await axios.post(getServerUrl('createCart'), {
        shopName,
        cartInput: { lines: [] }
      });

      const newCartId = response.data.data.cartCreate.cart.id;
      localStorage.setItem('cartId', newCartId);
      localStorage.setItem('shopName', shopName);
      setCartId(newCartId);
      setShopName(shopName);

      setCarts(prevCarts => ({
        ...prevCarts,
        [shopName]: { id: newCartId, lines: [] }
      }));
      return newCartId;
    } catch (error) {
      console.error('Error creating cart:', error);
    }
  };

  const addToCart = async (product, quantity) => {
    let cartId = carts[product.vendor]?.id;
    if (!cartId) {
      cartId = await createCart(product.vendor);
    }

    const variantId = product.variants.edges[0].node.id;

    const response = await axios.post(getServerUrl('addCartLines'), {
      shopName: product.vendor,
      cartId: cartId,
      lines: [{ quantity: quantity, merchandiseId: variantId }]
    });

    setCarts(prevCarts => ({
      ...prevCarts,
      [product.vendor]: response.data.data.cartLinesAdd.cart
    }));
  };

  // Clear cart function
  const clearCart = () => {
    // Remove cart info from localStorage
    localStorage.removeItem('cartId');
    localStorage.removeItem('shopName');
    // Reset state
    setCarts({});
    setCartId(null);
    setShopName(null);
  };

  return {
    carts,
    addToCart,
    fetchCartInfo,
    clearCart // Expose clearCart function
  };
};
