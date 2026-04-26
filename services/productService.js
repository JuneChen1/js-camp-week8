// ========================================
// 產品服務
// ========================================

const { fetchProducts } = require('../api');
const { getDiscountRate, getAllCategories, formatCurrency } = require('../utils');

/**
 * 取得所有產品
 * @returns {Promise<Object>}
 */
async function getProducts() {
  const products = await fetchProducts();
  return {products, count: products.length};
}

/**
 * 根據分類篩選產品
 * @param {string} category - 分類名稱
 * @returns {Promise<Array>}
 */
async function getProductsByCategory(category) {
  const products = await fetchProducts();
  return products.filter(item => item.category === category);
}

/**
 * 根據 ID 取得單一產品
 * @param {string} productId - 產品 ID
 * @returns {Promise<Object|null>}
 */
async function getProductById(productId) {
  const products = await fetchProducts();
  return products.find(item => item.id === productId) || null
}

/**
 * 取得所有分類（不重複）
 * @returns {Promise<Array>}
 */
async function getCategories() {
  const products = await fetchProducts();
  return getAllCategories(products);
}

/**
 * 顯示產品列表
 * @param {Array} products - 產品陣列
 */
function displayProducts(products) {
  let result = '';

  products.forEach((product, index) => {
    const {title, category, origin_price, price} = product;

    result += `
    ----------------------------------------
    ${index + 1}. ${title}
       分類：${category}
       原價：${formatCurrency(origin_price)}
       售價：${formatCurrency(price)} (${getDiscountRate(product)})`
  })

  return result
}

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductById,
  getCategories,
  displayProducts
};
