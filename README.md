# HMW Catalog

Browse products, manage cart, and checkout directly via WhatsApp.

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Text editor (VS Code recommended)

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React & React Icons
- **State Management**: Zustand
- **Data Fetching**: Axios
- **API**: DummyJSON

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd fastrac-catalog

# 2. Install dependencies
npm install

# Install Shadcn UI components (jika belum)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog badge input

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dan tambahkan nomor WhatsApp Anda

# 4. Run development server
npm run dev

# 5. Open browser
# Kunjungi http://localhost:3000
```

### Environment Variables

Buat file `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://dummyjson.com
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here

# WhatsApp Configuration (WAJIB)
NEXT_PUBLIC_WHATSAPP_NUMBER=628xxxxxxxxx

# App Configuration
NEXT_PUBLIC_APP_NAME=HMW
```

---

## Arsitektur & Keputusan Teknis

### Alasan Pemilihan Tech Stack

**Next.js 14?**

Next.js 14 dipilih karena menyediakan App Router modern dengan server components, performa optimal dengan built-in optimization (Image, Font, dll), kemampuan SEO melalui server-side rendering, dan developer experience yang sangat baik dengan fast refresh dan dukungan TypeScript penuh.

**Zustand?**

Zustand dipilih karena kesederhanaannya tanpa boilerplate seperti Redux, performa tinggi dengan minimal re-renders, kemudahan persist ke localStorage, dan ukuran yang sangat kecil hanya ~1KB gzipped.

**Tailwind CSS?**

Tailwind CSS mempercepat pengembangan UI, memberikan konsistensi melalui utility classes, performa tinggi dengan purged unused CSS di production, dan dukungan dark mode yang sudah built-in.

**Shadcn UI?**

Shadcn UI dipilih karena komponennya fully customizable (bukan package dependency), berbasis Radix UI yang accessible, terintegrasi sempurna dengan Tailwind CSS, dan kita memiliki kontrol penuh atas kode komponen. Untuk icons menggunakan kombinasi Lucide React dan React Icons.

**Axios?**

Axios digunakan untuk data fetching karena API yang lebih clean dibanding fetch native, built-in request/response interceptors untuk auth token, automatic JSON transformation, dan error handling yang lebih baik dengan proper type safety.

**DummyJSON API**

- Data Lengkap dan Realistis
  DummyJSON menyediakan struktur data yang menyerupai data e-commerce nyata — mencakup title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, dan images. Hal ini memungkinkan pengujian UI katalog produk dengan data yang kredibel dan lengkap.
- Endpoint CRUD yang Aman & Terisolasi
  Salah satu keunggulan utama DummyJSON dibanding mock API lain (seperti Fake Store API atau yang lainnya) adalah sistem CRUD-nya yang tidak memengaruhi data global.
  Ini membuat DummyJSON jauh lebih stabil dan aman untuk digunakan dalam proyek pembelajaran atau demo publik.

### Struktur Proyek

```
HMW/
├── src/
│   ├── app/                    # Next.js App Router (Halaman)
│   │   ├── page.tsx           # Landing page
│   │   ├── products/          # Katalog produk
│   │   ├── cart/              # Keranjang belanja
│   │   ├── login/             # Autentikasi
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/            # Komponen React
│   │   ├── ui/               # Komponen base Shadcn UI
│   │   ├── layout/           # Navbar, BottomNav
│   │   ├── product/          # Product Card, Grid, Dialog
│   │   └── cart/             # Cart Item, Summary
│   │
│   ├── store/                 # State Management Zustand
│   │   ├── cartStore.ts      # State & actions cart
│   │   └── authStore.ts      # State & actions auth
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useCart.ts        # Wrapper operasi cart
│   │   └── useAuth.ts        # Wrapper operasi auth
│   │
│   ├── lib/                   # Utilities & Helpers
│   │   ├── api.ts            # API client & Afunctions
│   │   └── utils.ts          # Helper functions
│   │
│   ├── types/                 # Definisi TypeScript
│   │   └── index.ts          # Semua type definitions
│   │
│   └── constants/             # Konstanta Aplikasi
│       └── index.ts          # Config, endpoints, templates
│
├── public/                    # Asset statis
├── .env.example              # Template environment
└── README.md                 # File ini
```

### Alur State Management

```
User Action → Component → Zustand Store → Update State → Re-render UI
                               ↓
                         Persist ke LocalStorage
```

**Contoh: Menambah Produk ke Cart**

Ketika user klik "Add to Cart" di ProductCard, hook `useCart()` akan memanggil `cartStore.addItem()` di Zustand store. Store kemudian mengecek apakah produk sudah ada di cart. Jika ya, quantity akan ditambah. Jika tidak, produk baru ditambahkan. Setelah itu, store menghitung ulang total (totalItems, subtotal). Zustand secara otomatis menyimpan ke localStorage dan memicu re-render component yang subscribe. Akhirnya UI terupdate (badge cart, halaman cart).

---

## Design System

### Color Palette (Dark Monochrome)

```css
--background: #0a0a0a    /* Deep Black */
--card: #0f0f0f          /* Background Card */
--secondary: #1a1a1a     /* Elemen Sekunder */
--muted: #262626         /* Muted/Borders */
--foreground: #fafafa    /* Teks */
--primary: #ffffff       /* Aksen Putih */
```

### Typography

- **Font Family**: Inter (System fallback)
- **Headings**: Bold, ukuran besar
- **Body**: Regular, ukuran mudah dibaca
- **Code**: Monospace untuk SKU/info teknis

### Prinsip Design

1. **Mobile-First**: Didesain untuk mobile, lalu scale ke desktop
2. **Dark Theme**: Mengurangi kelelahan mata, estetika modern
3. **High Contrast**: Putih di atas hitam untuk kejelasan
4. **Minimal**: Bersih, fokus pada konten
5. **Fast**: Gambar teroptimasi, lazy loading

---

## Keamanan & Best Practices

### Langkah-langkah Keamanan

**Environment Variables**: API keys disimpan di `.env.local` (tidak di-commit ke git). Variabel server-side diberi prefix `NEXT_PUBLIC_`. Template `.env.example` disediakan untuk setup.

**API Security**: Token auth disimpan di localStorage (client-side only). Request interceptor otomatis menambahkan Bearer token. Response 401 otomatis membersihkan data auth.

**Input Validation**: Validasi form di client dan server. Proteksi XSS melalui built-in escaping React. Type safety melalui TypeScript.

### Optimasi Performa

**Images**: Menggunakan Next.js Image component dengan optimasi otomatis, lazy loading dengan blur placeholder, dan responsive sizes untuk berbagai viewport.

**Code Splitting**: Route-based code splitting otomatis, dynamic imports untuk komponen berat, dan tree-shaking untuk kode yang tidak digunakan.

**Caching**: Cart disimpan di localStorage, dan response API bisa di-cache (enhancement masa depan).

---

### Fitur Inti

**Katalog Produk**: Menampilkan produk dari 3 kategori (shirts, shoes, watches) dengan gambar, nama, harga, varian, badge diskon, indikator stok, dan rating.

**Search & Filter**: Pencarian real-time di title, description, dan brand. Filter kategori (All, Shirts, Shoes, Watches). Opsi sorting (Newest, Price, Rating). Badge filter aktif dengan opsi clear.

**Keranjang Belanja**: Tambah/hapus produk, penyesuaian quantity dengan batasan stok, kalkulasi subtotal real-time, cart persisten (bertahan setelah refresh), dan fungsi clear cart.

**WhatsApp Checkout**: Pesan pre-filled dengan detail order, format dengan SKU, quantity, dan harga. Membuka di tab baru ke nomor yang dikonfigurasi dengan template pesan profesional.

**Responsive Design**: Pendekatan mobile-first, bottom navigation untuk mobile, sidebar navigation untuk desktop, tombol touch-friendly (min 44px), dan layout grid adaptif.

**Autentikasi (Opsional)**: Login dengan DummyJSON API, kredensial demo tersedia, auth berbasis token, dan protected routes (enhancement masa depan).

### Fitur UI/UX

**Product Card**: Hover effects dengan overlay, tombol quick add to cart, modal view details, dan indikator in-cart.

**Product Dialog**: Gallery gambar dengan thumbnails, selector quantity, ketersediaan stok, info shipping & warranty, buy now (langsung WhatsApp), dan sticky bottom navbar untuk checkout.

**Mobile Bottom Nav**: Home, Products, Cart, Account dengan indikator aktif, badge cart dengan count, dan transisi smooth.

**Loading States**: Skeleton loaders untuk produk, loading spinners untuk actions, dan disabled states selama processing.

---

## Integrasi API dengan Axios

Axios digunakan sebagai HTTP client dengan konfigurasi interceptors untuk automatic auth token injection dan error handling. Instance axios dibuat dengan base URL dari environment variables dan memiliki request/response interceptors yang SSR-safe (check `typeof window`).

**Fitur utama**:

- Auto inject Bearer token dari localStorage
- Auto cleanup auth data saat 401 unauthorized
- Type-safe dengan TypeScript interfaces
- Centralized error handling
- Constants-based endpoints management

API functions utama: `getProductsByCategory()`, `getAllCatalogProducts()`, `searchProducts()`, `loginUser()`, dan `getCurrentUser()`.

---

## Shadcn UI & Icons

### Komponen yang Digunakan

Project ini menggunakan Shadcn UI untuk komponen base dengan customization penuh:

**Core Components**: `Button`, `Badge`, `Card`, `Dialog`, `Sheet`, `Separator`, `Input`, `Label`, `Select`, `Toast`

**Icons**: Kombinasi **Lucide React** (untuk UI icons seperti ShoppingCart, Menu, Search) dan **React Icons** (untuk social media dan brand icons).

Semua komponen Shadcn UI dapat di-customize langsung di folder `components/ui/` karena kodenya ada di project, bukan di `node_modules`.

---

## Integrasi API

### DummyJSON API

**Base URL**: `https://dummyjson.com`

**Endpoints yang Digunakan**:

```typescript
// Products
GET /products/category/mens-shirts
GET /products/category/mens-shoes
GET /products/category/mens-watches
GET /products/{id}
GET /products/search?q={query}

// Authentication
POST /auth/login
GET /auth/me
```

**Kategori**: Hanya 3 kategori spesifik yang di-fetch: `mens-shirts`, `mens-shoes`, `mens-watches`

### Error Handling

```typescript
try {
  const products = await getAllCatalogProducts();
} catch (error) {
  console.error("Error:", error);
  // Tampilkan error toast ke user
  // Fallback ke empty state
}
```

---

## Trade-offs & Peningkatan Masa Depan

### Trade-offs yang Diambil (Karena Keterbatasan Waktu)

**No Server-Side Rendering untuk Products**: Saat ini menggunakan client-side data fetching untuk pengembangan lebih cepat dan state management lebih sederhana. Kedepannya bisa dipindah ke Server Components untuk SEO yang lebih baik.

**Implementasi Auth Sederhana**: Login bersifat opsional dengan token di localStorage karena requirement bersifat opsional dan fokus pada core catalog. Kedepannya bisa dibuat full auth flow dengan protected routes.

**Tidak Ada Sistem Variants**: Saat ini tidak ada pemilihan size/color karena DummyJSON tidak menyediakan data variant. Kedepannya bisa ditambahkan variant selector jika API real menyediakan data.

**State Management Sederhana**: Menggunakan Zustand saja karena cukup untuk scope saat ini. Kedepannya bisa menambahkan React Query untuk server state.

### Enhancement Masa Depan

**High Priority**:

1. **Order History**: Tracking order WhatsApp sebelumnya
2. **Favorites**: Simpan produk favorit
3. **Price Alerts**: Notifikasi saat produk sale
4. **Bulk Actions**: Pilih multiple products

**Medium Priority**:

5. **Advanced Filters**: Range harga, brand, rating
6. **Product Comparison**: Bandingkan 2-3 produk
7. **Reviews System**: Tambah/lihat review produk
8. **Analytics**: Track produk populer

**Low Priority**:

9. **Dark/Light Toggle**: Preferensi user
10. **Export Cart**: Download sebagai PDF/CSV
11. **Share Cart**: Share via link
12. **Multi-language**: Dukungan i18n
13. **Dashboard Admin**: Manage Product,Manage Order

---

## Development Experience & Pembelajaran

### Tantangan yang Dihadapi

**TypeScript dengan Zustand Persist**: Masalah type inference dengan persist middleware. Solusinya adalah menggunakan proper generic typing dengan `persist<CartStore>()`.

**Image Optimization**: Gambar eksternal dari DummyJSON. Solusinya adalah mengkonfigurasi `next.config.js` untuk external domains.

**Mobile Bottom Nav Spacing**: Konten tersembunyi di balik fixed nav. Solusinya adalah menambahkan spacer div dengan tinggi yang sama.

### Pembelajaran Kunci

**Zustand Perfect untuk Skala Ini**: API sederhana tanpa boilerplate, sempurna untuk aplikasi kecil-menengah, dan sync localStorage sangat mudah.

**Mobile-First Sangat Penting**: Lebih mudah scale up daripada down, bottom nav memberikan UX lebih baik dari hamburger menu, dan touch targets harus minimal 44px.

**Component Composition**: ProductCard → ProductDialog memberikan clean separation, CartItem reusable dengan variants, dan layout components (Navbar, BottomNav) terisolasi dengan baik.

---
