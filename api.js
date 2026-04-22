// ========================================
// API 請求函式
// ========================================

const axios = require('axios');
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require('./config');
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/livejs/v1/customer/${API_PATH}`
});
const apiAdmin = axios.create({
  baseURL: `${BASE_URL}/api/livejs/v1/admin/${API_PATH}`,
  headers: { authorization: ADMIN_TOKEN }
}); 

// ========== 客戶端 API ==========

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
  try {
    const response = await apiClient.get('/products');
    return response.data.products;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
  try {
    const response = await apiClient.get('/carts');
    const {carts, total, finalTotal} = response.data;
    
    return {carts, total, finalTotal};
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
  try {
    const response = await apiClient.post('/carts', {
      data: { productId, quantity }
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
  try {
    const response = await apiClient.patch('/carts', {
      data: { id: cartId, quantity }
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function deleteCartItem(cartId) {
  try {
    const response = await apiClient.delete(`/carts/${cartId}`);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function clearCart() {
  try {
    const response = await apiClient.delete('/carts');
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function createOrder(userInfo) {
  try {
    const {name, tel, email, address, payment} = userInfo;
    const response = await apiClient.post('/orders', {
      data: {
        user: { name, tel, email, address, payment }
      }
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

// ========== 管理員 API ==========

/**
 * 管理員 API 需加上認證
 * 提示：
    headers: {
      authorization: ADMIN_TOKEN
    }
 */

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
  try {
    const response = await apiAdmin.get('/orders');
    return response.data.orders;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updateOrderStatus(orderId, isPaid) {
  try {
    const response = await apiAdmin.put('/orders', {
      data: {
        id: orderId,
        paid: isPaid
      }
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function deleteOrder(orderId) {
  try {
    const response = await apiAdmin.delete(`/orders/${orderId}`);
    return response.data.orders;
  } catch (error) {
    console.error(error.response.data);
  }
}

module.exports = {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder
};
