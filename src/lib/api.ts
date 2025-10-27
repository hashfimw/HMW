import axios, { AxiosInstance } from "axios";
import type { Product, ProductsResponse, AuthResponse, LoginCredentials } from "@/types";
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from "@/constants/index.";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    return Promise.reject(error);
  }
);

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get<ProductsResponse>(
      API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category)
    );
    return data.products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const getAllCatalogProducts = async (): Promise<Product[]> => {
  try {
    const categories = ["mens-shirts", "mens-shoes", "mens-watches"];
    const promises = categories.map((cat) => getProductsByCategory(cat));
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching all catalog products:", error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const { data } = await apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get<ProductsResponse>(API_ENDPOINTS.PRODUCT_SEARCH, {
      params: { q: query },
    });
    return data.products.filter((p) =>
      ["mens-shirts", "mens-shoes", "mens-watches"].includes(p.category)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      credentials
    );

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const { data } = await apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH_ME);
    return data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

export const logoutUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};
