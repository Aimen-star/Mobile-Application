const DOLLAR_TO_RUPEE = 280;

// Individual sale percentages for products from the teacher's Fake Store API.
const FAKE_STORE_SALE_PERCENT = {
  1: 15,
  3: 10,
  5: 20,
  7: 15,
};

export const MINIMUM_ORDER_FOR_DISCOUNT = 1200;
export const ORDER_DISCOUNT_PERCENT = 20;

export function getProductPrice(product) {
  const originalPrice = Math.round(
    Number(product?.price || 0) * DOLLAR_TO_RUPEE
  );

  // DummyJSON includes a discountPercentage field on its products.
  const dummyJsonSale =
    product?.apiSource === 'dummyjson'
      ? Number(product.discountPercentage || 0)
      : 0;

  // Fake Store products use the app's demonstration sale list above.
  const salePercent =
    dummyJsonSale || FAKE_STORE_SALE_PERCENT[product?.id] || 0;

  const hasSale = salePercent > 0;
  const finalPrice = hasSale
    ? Math.round(originalPrice * (1 - salePercent / 100))
    : originalPrice;

  return {
    originalPrice,
    finalPrice,
    salePercent,
    hasSale,
  };
}

// The order discount applies only when the subtotal is above Rs. 1,200.
export function getOrderDiscount(subtotal) {
  return subtotal > MINIMUM_ORDER_FOR_DISCOUNT
    ? Math.round(subtotal * (ORDER_DISCOUNT_PERCENT / 100))
    : 0;
}