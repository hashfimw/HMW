import { formatCurrency } from "@/lib/utils";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const CATEGORIES = [
  { value: "mens-shirts", label: "Men's Shirts" },
  { value: "mens-shoes", label: "Men's Shoes" },
  { value: "mens-watches", label: "Men's Watches" },
] as const;

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
  PRODUCT_SEARCH: "/products/search",
  AUTH_LOGIN: "/auth/login",
  AUTH_ME: "/auth/me",
} as const;

export const PRODUCTS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

export const WHATSAPP_MESSAGE_TEMPLATE = (cart: {
  items: Array<{
    product: { title: string; sku: string; price: number };
    quantity: number;
    selectedVariant?: string;
  }>;
  totalItems: number;
  subtotal: number;
}) => {
  const orderDetails = cart.items
    .map((item, index) => {
      const variant = item.selectedVariant ? ` (${item.selectedVariant})` : "";
      return `${index + 1}. ${item.product.title}${variant}\n   SKU: ${
        item.product.sku
      }\n   Qty: ${item.quantity}x @ ${formatCurrency(
        item.product.price
      )}\n   Subtotal: ${formatCurrency(item.product.price * item.quantity)}`;
    })
    .join("\n\n");

  return `*NEW ORDER - ${APP_NAME}*\n\n${orderDetails}\n\n---\n*Total Items:* ${
    cart.totalItems
  }\n*Grand Total:* ${formatCurrency(
    cart.subtotal
  )}\n\nMohon proses pesanan ini. Terima kasih! 🙏`;
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: "fastrac-cart",
  AUTH_TOKEN: "fastrac-auth-token",
  USER: "fastrac-user",
} as const;

export const TEST_USER = {
  username: "emilys",
  password: "emilyspass",
} as const;
