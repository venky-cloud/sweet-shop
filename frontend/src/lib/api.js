import { fallbackProducts } from "../data/products.js";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING, GST_RATE } from "./currency.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function safeFetch(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Every read falls back to the local catalog so the storefront stays browsable
// even when the backend / database isn't running.
export async function getProducts({ category, featured } = {}) {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (featured) params.set("featured", "true");
    const qs = params.toString();
    return await safeFetch(`/products${qs ? `?${qs}` : ""}`);
  } catch {
    let list = fallbackProducts;
    if (category) list = list.filter((p) => p.category === category);
    if (featured) list = list.filter((p) => p.featured);
    return list;
  }
}

export async function getProduct(idOrSlug) {
  try {
    return await safeFetch(`/products/${idOrSlug}`);
  } catch {
    const found = fallbackProducts.find((p) => p._id === idOrSlug || p.slug === idOrSlug);
    if (!found) throw new Error("Product not found");
    return found;
  }
}

export async function createOrder(payload) {
  // Orders require the live backend — a stub confirmation is generated for
  // demo mode so checkout still completes when there is no API/database.
  try {
    return { data: await safeFetch("/orders", { method: "POST", body: JSON.stringify(payload) }), demo: false };
  } catch (err) {
    // A response with a status means the backend is reachable and actively
    // rejected the request (e.g. validation) — surface that instead of
    // masking it as an unreachable-backend demo order.
    if (err.status) throw err;

    const items = payload.items.map((item) => {
      const product = fallbackProducts.find((p) => p._id === item.productId) || {};
      const option = (product.weightOptions || []).find((w) => w.label === item.weightLabel) || {};
      return {
        name: product.name || "Item",
        price: option.price || 0,
        weightLabel: item.weightLabel,
        image: product.image,
        shape: product.shape,
        fill: product.fill,
        tone: product.tone,
        qty: item.qty,
      };
    });
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + shipping + tax;
    return {
      data: {
        _id: `demo-${Date.now()}`,
        items,
        customer: payload.customer,
        paymentMethod: payload.paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      demo: true,
      demoReason: err.message,
    };
  }
}

export async function getOrder(id) {
  return safeFetch(`/orders/${id}`);
}
