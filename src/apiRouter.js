const isProduction = false;

const urlMap = [
  {
    'name': 'encryptAccessToken',
    'production': 'https://your-production-url.com/encryptAccessToken',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/encryptAccessToken'
  },
  {
    'name': 'decryptAccessToken',
    'production': 'https://your-production-url.com/decryptAccessToken',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/decryptAccessToken'
  },
  {
    'name': 'registerVendor',
    'production': 'https://your-production-url.com/registerVendor',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/registerVendor'
  },
  {
    'name': 'getProductListings',
    'production': 'https://your-production-url.com/getProductListings',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/getProductListings'
  },
  {
    'name': 'getCartInfo',
    'production': 'https://your-production-url.com/getCartInfo',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/getCartInfo'
  },
  {
    'name': 'createCart',
    'production': 'https://your-production-url.com/createCart',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/createCart'
  },
  {
    'name': 'addCartLines',
    'production': 'https://your-production-url.com/addCartLines',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/addCartLines'
  },
  {
    'name': 'updateCartBuyerIdentity',
    'production': 'https://your-production-url.com/updateCartBuyerIdentity',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/updateCartBuyerIdentity'
  },
  {
    'name': 'getCheckoutURL',
    'production': 'https://your-production-url.com/getCheckoutURL',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/getCheckoutURL'
  },
  {
    'name': 'getProducts',
    'production': 'https://your-production-url.com/getProducts',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/getProducts'
  },
  {
    'name': 'getAllProducts',
    'production': 'https://your-production-url.com/getProducts',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/getAllProducts'
  },
  {
    'name': 'removeCartLines',
    'production': 'https://your-production-url.com/removeCartLines',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/removeCartLines'
  },
  {
    'name': 'clearCart',
    'production': 'https://your-production-url.com/clearCart',
    'local': 'http://127.0.0.1:5001/sake-311119/us-central1/clearCart'
  }
];

export const getServerUrl = (endpointName) => {
  const endpoint = urlMap.find(item => item.name === endpointName);
  if (!endpoint) {
    throw new Error(`Endpoint ${endpointName} not found.`);
  }
  return isProduction ? endpoint.production : endpoint.local;
};