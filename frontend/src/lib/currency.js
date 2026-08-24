const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount) {
  return formatter.format(amount || 0);
}

export const FREE_SHIPPING_THRESHOLD = 999;
export const FLAT_SHIPPING = 79;
export const GST_RATE = 0.05;
