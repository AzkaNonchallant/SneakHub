# SneakHub API Documentation

Collection API SneakHub (Go Fiber Framework) • Postman v2.1.0

Schema: `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`

## Collection Variables

| Variable | Default Value | Type |
|---|---|---|
| `base_url` | `https://api-sneakhub.reihan.biz.id/` | string |
| `token` | (kosong) | string |
| `product_id` | (kosong) | string |
| `order_id` | (kosong) | string |
| `address_id` | (kosong) | string |
| `category_id` | (kosong) | string |
| `brand_id` | (kosong) | string |
| `seller_id` | (kosong) | string |
| `customer_id` | (kosong) | string |
| `cart_item_id` | (kosong) | string |
| `image_id` | (kosong) | string |

---

## 1. Auth & User

### POST 1.1 Register
`{{base_url}}/api/auth/register`

**Headers:** `Content-Type: application/json`

**Deskripsi:** Registrasi customer baru. Token disimpan otomatis.

**Body (raw JSON):**
```json
{
  "nama": "Budi",
  "email": "budi@mail.com",
  "password": "rahasia123",
  "nomor_telepon": "08123456789"
}
```

**Post-response script (test):** Mengambil `data.access_token` dari response dan menyimpannya ke collection variable `token`.
```javascript
const json = pm.response.json();
if (json.data && json.data.access_token) {
  pm.collectionVariables.set("token", json.data.access_token);
}
```

### POST 1.2 Login
`{{base_url}}/api/auth/login`

**Headers:** `Content-Type: application/json`

**Deskripsi:** Login. Token disimpan otomatis ke variable `token`.

**Body (raw JSON):**
```json
{
  "email": "budi@mail.com",
  "password": "rahasia123"
}
```

**Post-response script (test):** Menyimpan `data.access_token` ke variable `token`.
```javascript
const json = pm.response.json();
if (json.data && json.data.access_token) {
  pm.collectionVariables.set("token", json.data.access_token);
}
```

### GET 1.3 Get Me
`{{base_url}}/api/users/me`

**Headers:** `Authorization: Bearer {{token}}`

### PUT 1.4 Update Me
`{{base_url}}/api/users/me`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama": "Budi Santoso",
  "nomor_telepon": "081234567890",
  "preferensi_ukuran": ["42"],
  "brand_favorit": ["Nike"]
}
```

### POST 1.5 Seller Activation
`{{base_url}}/api/users/me/seller-activation`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** Aktivasi akun menjadi seller.

**Body (raw JSON):**
```json
{
  "nama_toko": "Toko Budi",
  "deskripsi_toko": "Toko sepatu original premium"
}
```

---

## 2. Category

### GET 2.1 List Categories
`{{base_url}}/api/category`

**Headers:** `Authorization: Bearer {{token}}`

### POST 2.2 Create Category (Admin)
`{{base_url}}/api/category`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_kategori": "Sepatu Lari"
}
```

### PUT 2.3 Update Category (Admin)
`{{base_url}}/api/category/{{category_id}}`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_kategori": "Sepatu Casual"
}
```

### DELETE 2.4 Delete Category (Admin)
`{{base_url}}/api/category/{{category_id}}`

**Headers:** `Authorization: Bearer {{token}}`

---

## 3. Product

### GET 3.1 List Products
`{{base_url}}/api/products?...`

**Headers:** `Authorization: Bearer {{token}}`

**Deskripsi:** List produk dengan pagination & filter.

**Query Parameters:**

| Key | Value | Disabled |
|---|---|---|
| `page` | 1 | tidak |
| `limit` | 20 | tidak |
| `search` | (kosong) | ya |
| `brand_id` | (kosong) | ya |
| `category_id` | (kosong) | ya |
| `kondisi` | new | ya |
| `min_price` | (kosong) | ya |
| `max_price` | (kosong) | ya |
| `size` | (kosong) | ya |
| `sort` | (kosong) | ya |

### GET 3.2 Product Detail
`{{base_url}}/api/products/{{product_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 3.3 Create Product (Seller/Admin)
`{{base_url}}/api/products`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_produk": "Nike Air Force 1 White",
  "brand_id": "{{brand_id}}",
  "category_id": "{{category_id}}",
  "kondisi": "new",
  "deskripsi": "Sepatu original 100%, kondisi baru",
  "harga": 1200000,
  "stok": 5,
  "status_publikasi": "aktif",
  "ukuran_tersedia": ["40", "41", "42"],
  "condition_score": 9.5
}
```

### PUT 3.4 Update Product (Seller/Admin)
`{{base_url}}/api/products/{{product_id}}`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_produk": "Nike Air Force 1 White 2024",
  "brand_id": "{{brand_id}}",
  "category_id": "{{category_id}}",
  "kondisi": "new",
  "deskripsi": "Sepatu original 100%, kondisi baru",
  "harga": 1250000,
  "stok": 4,
  "status_publikasi": "aktif",
  "ukuran_tersedia": ["40", "41", "42", "43"]
}
```

### DELETE 3.5 Delete Product (Seller/Admin)
`{{base_url}}/api/products/{{product_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 3.6 Upload Product Image (Seller/Admin)
`{{base_url}}/api/products/{{product_id}}/images`

**Headers:** `Authorization: Bearer {{token}}`

**Body (form-data):**

| Key | Type | Value |
|---|---|---|
| `gambar` | file | (pilih file) |
| `urutan_tampil` | text | 1 |

### GET 3.7 List Product Images
`{{base_url}}/api/products/{{product_id}}/images`

**Headers:** `Authorization: Bearer {{token}}`

### DELETE 3.8 Delete Product Image (Seller/Admin)
`{{base_url}}/api/products/{{product_id}}/images/{{image_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 3.9 Search Product by Image
`{{base_url}}/api/products/search-by-image`

**Headers:** `Authorization: Bearer {{token}}`

**Deskripsi:** Cari produk berdasarkan gambar (AI).

**Body (form-data):**

| Key | Type | Value |
|---|---|---|
| `gambar` | file | (pilih file) |
| `limit` | text | 10 |

---

## 4. Cart

### GET 4.1 Get Cart
`{{base_url}}/api/carts`

**Headers:** `Authorization: Bearer {{token}}`

### POST 4.2 Add Items to Cart
`{{base_url}}/api/carts/items`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "items": [
    {
      "product_id": "{{product_id}}",
      "jumlah": 1
    }
  ]
}
```

### PUT 4.3 Update Cart Item
`{{base_url}}/api/carts/items/{{cart_item_id}}`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "jumlah": 2
}
```

### DELETE 4.4 Delete Cart Item
`{{base_url}}/api/carts/items/{{cart_item_id}}`

**Headers:** `Authorization: Bearer {{token}}`

---

## 5. Address

### GET 5.1 List Addresses
`{{base_url}}/api/addresses`

**Headers:** `Authorization: Bearer {{token}}`

### GET 5.2 Address Detail
`{{base_url}}/api/addresses/{{address_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 5.3 Create Address
`{{base_url}}/api/addresses`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_penerima": "Budi",
  "nomor_telepon": "08123456789",
  "alamat": "Jl. Merdeka No. 10",
  "kota": "Bandung",
  "provinsi": "Jawa Barat",
  "kode_pos": "40111",
  "is_default": true
}
```

### PUT 5.4 Update Address
`{{base_url}}/api/addresses/{{address_id}}`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "nama_penerima": "Budi Santoso",
  "nomor_telepon": "081234567890",
  "alamat": "Jl. Merdeka No. 12",
  "kota": "Bandung",
  "provinsi": "Jawa Barat",
  "kode_pos": "40111",
  "is_default": true
}
```

### DELETE 5.5 Delete Address
`{{base_url}}/api/addresses/{{address_id}}`

**Headers:** `Authorization: Bearer {{token}}`

---

## 6. Checkout & Payment

### POST 6.1 Checkout
`{{base_url}}/api/checkout`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** `metode_pembayaran`: `EWALLET` (QRIS) | `BANK_TRANSFER` / `VA` (BCA VA). Respons berisi `payment_url`.
- Mode `mock` → halaman bayar `/api/mock-pay/:order_id`
- Mode `midtrans` / `tripay` → redirect ke Snap/checkout page

**Body (raw JSON):**
```json
{
  "address_id": "{{address_id}}",
  "metode_pembayaran": "EWALLET"
}
```

### GET 6.2 Mock Pay Page
`{{base_url}}/api/mock-pay/{{order_id}}`

**Headers:** `Authorization: Bearer {{token}}`

**Deskripsi:** Halaman bayar mock (hanya aktif saat `PAYMENT_MODE=mock`).

### POST 6.3 Mock Settle
`{{base_url}}/api/payments/mock-settle`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** Simulasi pembayaran (hanya aktif saat `PAYMENT_MODE=mock`).

Status: `PAID` | `EXPIRED` | `FAILED` | `REFUND`

**Body (raw JSON):**
```json
{
  "order_id": "{{order_id}}",
  "status": "PAID"
}
```

### POST 6.4 Midtrans Notification
`{{base_url}}/api/payments/midtrans/notification`

**Headers:** `Content-Type: application/json`

**Deskripsi:** Callback Midtrans (hanya aktif saat `PAYMENT_MODE=midtrans`).

`signature_key = SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)`.

`gross_amount` harus berformat 2 desimal (mis. `"175000.00"`).

**Body (raw JSON):**
```json
{
  "transaction_status": "settlement",
  "fraud_status": "accept",
  "order_id": "{{order_id}}",
  "status_code": "200",
  "gross_amount": "175000.00",
  "transaction_id": "TEST-001",
  "signature_key": "<SHA512 order_id+status_code+gross_amount+server_key>"
}
```

---

## 7. Order

### GET 7.1 List Orders
`{{base_url}}/api/orders?page=1&limit=10&status=`

**Headers:** `Authorization: Bearer {{token}}`

**Deskripsi:** Customer: order miliknya. Seller: order tokonya. Admin: semua.

**Query Parameters:**

| Key | Value | Description |
|---|---|---|
| `page` | 1 | - |
| `limit` | 10 | - |
| `status` | (kosong) | Alias: `PENDING` \| `PROCESSING` \| `SHIPPED` \| `COMPLETED` \| `CANCELLED` |

### GET 7.2 Order Detail
`{{base_url}}/api/orders/{{order_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 7.3 Create Order (Manual)
`{{base_url}}/api/orders`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** Order manual (tanpa payment gateway). Customer: `seller_id` dari body, `customer_id` dipaksa miliknya. Seller: sebaliknya. Admin: keduanya dari body.

**Body (raw JSON):**
```json
{
  "seller_id": "{{seller_id}}",
  "customer_id": "{{customer_id}}",
  "metode_pembayaran": "EWALLET",
  "alamat_pengiriman": {
    "nama_penerima": "Budi",
    "nomor_telepon": "08123456789",
    "alamat": "Jl. Merdeka No. 10",
    "kota": "Bandung",
    "provinsi": "Jawa Barat",
    "kode_pos": "40111"
  },
  "items": [
    {
      "product_id": "{{product_id}}",
      "jumlah": 1
    }
  ]
}
```

### PUT 7.4 Update Order Status
`{{base_url}}/api/orders/{{order_id}}`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** Status: `pending` | `diproses` | `dikirim` | `selesai` | `dibatalkan`. Customer hanya bisa set `"dibatalkan"`.

**Body (raw JSON):**
```json
{
  "status_order": "diproses"
}
```

### DELETE 7.5 Delete Order (Admin/Seller)
`{{base_url}}/api/orders/{{order_id}}`

**Headers:** `Authorization: Bearer {{token}}`

### POST 7.6 Create Review
`{{base_url}}/api/orders/{{order_id}}/review`

**Headers:** `Authorization: Bearer {{token}}` | `Content-Type: application/json`

**Deskripsi:** Customer only. Syarat: order miliknya, status selesai, produk ada di order, belum pernah review produk ini.

**Body (raw JSON):**
```json
{
  "product_id": "{{product_id}}",
  "rating": 5,
  "komentar": "Barang sesuai deskripsi dan pengiriman cepat."
}
```

---

## Ringkasan Endpoint

| Grup | Endpoint | Method |
|---|---|---|
| Auth & User | `/api/auth/register` | POST |
| Auth & User | `/api/auth/login` | POST |
| Auth & User | `/api/users/me` | GET |
| Auth & User | `/api/users/me` | PUT |
| Auth & User | `/api/users/me/seller-activation` | POST |
| Category | `/api/category` | GET |
| Category | `/api/category` | POST |
| Category | `/api/category/{{category_id}}` | PUT |
| Category | `/api/category/{{category_id}}` | DELETE |
| Product | `/api/products` | GET |
| Product | `/api/products/{{product_id}}` | GET |
| Product | `/api/products` | POST |
| Product | `/api/products/{{product_id}}` | PUT |
| Product | `/api/products/{{product_id}}` | DELETE |
| Product | `/api/products/{{product_id}}/images` | POST |
| Product | `/api/products/{{product_id}}/images` | GET |
| Product | `/api/products/{{product_id}}/images/{{image_id}}` | DELETE |
| Product | `/api/products/search-by-image` | POST |
| Cart | `/api/carts` | GET |
| Cart | `/api/carts/items` | POST |
| Cart | `/api/carts/items/{{cart_item_id}}` | PUT |
| Cart | `/api/carts/items/{{cart_item_id}}` | DELETE |
| Address | `/api/addresses` | GET |
| Address | `/api/addresses/{{address_id}}` | GET |
| Address | `/api/addresses` | POST |
| Address | `/api/addresses/{{address_id}}` | PUT |
| Address | `/api/addresses/{{address_id}}` | DELETE |
| Checkout & Payment | `/api/checkout` | POST |
| Checkout & Payment | `/api/mock-pay/{{order_id}}` | GET |
| Checkout & Payment | `/api/payments/mock-settle` | POST |
| Checkout & Payment | `/api/payments/midtrans/notification` | POST |
| Order | `/api/orders` | GET |
| Order | `/api/orders/{{order_id}}` | GET |
| Order | `/api/orders` | POST |
| Order | `/api/orders/{{order_id}}` | PUT |
| Order | `/api/orders/{{order_id}}` | DELETE |
| Order | `/api/orders/{{order_id}}/review` | POST |
