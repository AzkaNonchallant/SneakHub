# SneakHub — API Integration & Verification State

Ponytail ultra mode. Goal: wire Next.js storefront to live Go Fiber API (https://api-sneakhub.reihan.biz.id via `/api` proxy) and verify every built UI live.

## Environments & Accounts
- Dev must run: `NODE_OPTIONS=--dns-result-order=ipv4first bun run dev` (IPv6 broken on this machine). Network to API is FLAKY (intermittent connect failures) — retry naturally.
- Customer: `anton@mail.com`/`anton123` (user_id 74497364-4bdd-46b9-a3c7-fd18aaaf1478, token /tmp/opencode/anton.json).
- Seller: `budi@mail.com`/`rahasia123` — JWT role=seller BUT no store row; products/orders belong to store id `9af4280b-dbfe-4e0a-9f51-e18d603a3bc2`; gets `data toko seller tidak ditemukan` on GET/PUT /orders (store not approved). Token /tmp/opencode/budi.json. Login button on /login reads "Execute Login".
- QA seller (mine, cleanup candidate): `qaseller@mail.com`/`qaseller123`, store "QA Store" pending, effective JWT role stays customer until approval. Token /tmp/opencode/qaseller.json (full envelope).
- Product test data: "Nike Dunk Low Panda" `c35f5a7e-424f-43ff-9e44-a9b40e7a9b7a`, Rp 1.500.000 (PUT harga bugged, stays), stok 3, category Casual `4acb3aa7-cb30-4ebc-806b-b212af766e3c`, brand Nike `2d72d218-2e0b-449d-a3b2-1521cd21ff20` (DEFAULT_BRAND_ID). Orders: `90c35039-ae3c-4935-90a6-d5e5fbd587cb` (checkout+paid, diproses), `46425ab9-1042-4803-bb1c-4c27413ca822` (manual by budi, pending).
- Role helpers: isSellerRole = seller|penjual only (NOT admin per user); isAdminRole = admin. Guards in (dashboard)/layout + admin/layout redirect to /home.
- Key API quirks: envelope {success,message,data}, errors via errMessage(); cart items FLAT {cart_item_id,product_id,jumlah,subtotal,nama_produk,harga,image_url}; order shape {subtotal,biaya_pengiriman,total_pembayaran,items:[{harga_saat_transaksi,...}]}; list products has NO category_id; create/update product REQUIRES category_id + deskripsi >=10 chars; category field typo `cateogry_id`.

## Backend bugs found (report to friend)
1. PUT /api/products/:id IGNORES `harga` (echoes old value; everything else applies).
2. Seller stores stuck `status_verifikasi: pending`, NO admin approval endpoint exists → seller order endpoints 400. Need friend: approval endpoint/manual fix for budi + qaseller.
3. Review endpoint (POST /orders/:id/review) requires status selesai + ownership — client code correct (product_id/rating/komentar).

## Verified green (browser + live API)
Cart add ✓, checkout ✓ real Midtrans sandbox pay (card 4811 1111 1111 1114) → order auto diproses ✓, order detail ✓ totals, profile order cards ✓, edit profil ✓, address CRUD ✓, inventory render ✓, edit product dialog (deskripsi+kategori apply; harga blocked by backend bug) ✓, budi dashboard renders gracefully ✓, role guards ✓, category admin page built (needs real admin to test) ✓, review form renders only when selesai ✓ (logic).
Build: `bun run build` green; tsc clean; lint 0 err/22 warn (pre-existing).

## Remaining verification
Seller status-advance buttons + review submit end-to-end — blocked on store approval. NEXT: ping friend for (a) store approval, (b) harga bug; then verify; optionally delete qaseller.

## UI architecture notes
AddressDialog uses base-ui `render` prop on Dialog.Trigger (never nest Button inside Trigger). Tambah/edit product dialogs: description min-10 validation, category_id fallback to first category. Sonner Toaster rounded-none border-outline. Tokens in localStorage key `sneakhub_token` (lib/api.ts TOKEN_KEY).