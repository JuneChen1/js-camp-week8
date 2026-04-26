// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  const cart = await fetchCart();
  return cart
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  const validQuantity = validateCartQuantity(quantity);
  if (!validQuantity.isValid) return {success: false, error: validQuantity.error};

  try {
    const addResult = await addToCart();
    return {success: true, data: addResult};
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  const validQuantity = validateCartQuantity(quantity);
  if (!validQuantity.isValid) return {success: false, error: validQuantity.error};

  try {
    const updateResult = await updateCartItem(cartId, quantity);
    return {success: true, data: updateResult};
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  try {
    const deleteResult = await deleteCartItem(cartId);
    return {success: true, data: deleteResult};
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  try {
    const clearResult = await clearCart();
    return {success: true, data: clearResult};
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  const cart = await fetchCart();
  const {carts, total, finalTotal} = cart;
    
  return {total, finalTotal, itemCount: carts.length};
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  const cartItems = cart.carts;
  if (!cartItems || cartItems.length === 0) return '購物車是空的';

  const divider = '----------------------------------------';
  const itemList = [];

  cartItems.forEach((item, index) => {
    const title = item.product.title;
    const price = item.product.origin_price;
    const quantity = item.quantity;

    itemList.push(`${index + 1}. ${title}
   數量：${quantity}
   單價：${formatCurrency(price)}
   小計：${formatCurrency(quantity * price)}`);
  })

  const result = [
    '購物車內容：',
    divider,
    itemList.join(`\n${divider}\n`),
    divider,
    `商品總計：${formatCurrency(cart.total)}`,
    `折扣後金額：${formatCurrency(cart.finalTotal)}`
  ].join('\n');

  return result
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart
};
