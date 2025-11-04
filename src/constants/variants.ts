export interface ColorOption {
  name: string;
  hex: string;
}

export interface VariantConfig {
  sizes: string[];
  colors: ColorOption[];
}

// Variant configurations per category
const VARIANT_CONFIGS: Record<string, VariantConfig> = {
  "mens-shirts": {
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1e3a8a" },
      { name: "Gray", hex: "#6b7280" },
      { name: "Red", hex: "#dc2626" },
    ],
  },
  "mens-shoes": {
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Brown", hex: "#78350f" },
      { name: "Blue", hex: "#1e40af" },
      { name: "Gray", hex: "#4b5563" },
    ],
  },
  "mens-watches": {
    sizes: ["38mm", "42mm", "44mm"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Silver", hex: "#d1d5db" },
      { name: "Gold", hex: "#f59e0b" },
      { name: "Rose Gold", hex: "#ec4899" },
      { name: "Blue", hex: "#3b82f6" },
    ],
  },
};

// Default variant untuk kategori yang tidak terdaftar
const DEFAULT_VARIANT: VariantConfig = {
  sizes: ["One Size"],
  colors: [{ name: "Default", hex: "#000000" }],
};

/**
 * Get variant configuration berdasarkan kategori produk
 */
export function getProductVariants(category: string): VariantConfig {
  const normalizedCategory = category.toLowerCase();
  return VARIANT_CONFIGS[normalizedCategory] || DEFAULT_VARIANT;
}

/**
 * Check apakah produk punya multiple variants
 */
export function hasMultipleVariants(category: string): boolean {
  const variants = getProductVariants(category);
  return variants.sizes.length > 1 || variants.colors.length > 1;
}

/**
 * Format variant label untuk display
 */
export function formatVariantLabel(size: string, color: string): string {
  return `${size} / ${color}`;
}
