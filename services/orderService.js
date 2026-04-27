// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
  const validUser = validateOrderUser(userInfo);
  if (!validUser.isValid) return { success: false, errors: validUser.errors };

  try{
    const createResult = await createOrder(userInfo);
    return {success: true, data: createResult};
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
  const orders = await fetchOrders();
  return orders
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
  const orders = await fetchOrders();
  return orders.filter(order => order.paid === false);
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
  const orders = await fetchOrders();
  return orders.filter(order => order.paid === true);
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  try {
    const updateResult = await updateOrderStatus(orderId, isPaid);
    return { success: true, data: updateResult };
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  try {
    const removeResult = await deleteOrder(orderId);
    return { success: true, data: removeResult };
  } catch(error) {
    return {success: false, error: error.response.data};
  }
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
  return {
    ...order,
    totalFormatted: formatCurrency(order.total),
    paidText: order.paid === true ? '已付款' : '未付款',
    createdAt: formatDate(order.createdAt),
    daysAgo: getDaysAgo(order.createdAt)
  }
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
  if (!orders || orders.length === 0) return '沒有訂單';

  const boldDivider = '========================================';
  const thinDivider = '----------------------------------------';
  const orderList = [];

  orders.forEach((order, index) => {
    const {id, user, totalFormatted, paidText, createdAt, daysAgo, products, quantity} = formatOrder(order);

    orderList.push([
      `訂單${index + 1}`,
      thinDivider,
      `訂單編號：${id}`,
      `顧客姓名：${user.name}`,
      `聯絡電話：${user.tel}`,
      `寄送地址：${user.address}`,
      `付款方式：${user.payment}`,
      `訂單金額：${totalFormatted}`,
      `付款狀態：${paidText}`,
      `建立時間：${createdAt} (${daysAgo})`,
      thinDivider,
      '商品明細：',
      `- ${products[0].title} x ${quantity}`
      ].join('\n'));
  });

  const result = [
    '訂單列表：',
    boldDivider,
    orderList.join(`\n${boldDivider}\n`),
    boldDivider
  ].join('\n');

  return result
}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders
};
