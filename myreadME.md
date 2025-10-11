# Products API

This is a small Express + MongoDB API for managing products. The server is defined in `server.js` and the product endpoints live in `routes/productRoutes.js`.

## Requirements

- Node.js (v14+ recommended)
- A MongoDB connection (Atlas or local)
- An API key (used by the project's auth middleware)

## Setup

1. Install dependencies

```powershell
npm install
```

2. Copy `.env.example` to `.env` and fill in values

```powershell
copy .env.example .env
```

3. Start the server

```powershell
# Run with Node
node server.js

# (Optional) Use nodemon for automatic restarts if you have it installed
npx nodemon server.js
```

By default the server listens on the port defined in `PORT` (or `5000` if not set). When running you should see a console message like `Server running on http://localhost:5000`.

## Authentication

All `/products` endpoints are protected by a simple API key middleware. Include the header `x-api-key` with the value of `API_KEY` from your `.env` file.

Example header:

```
x-api-key: your_api_key_here
```

## Environment variables

See `.env.example` for required variables. Minimal required variables are:

- `MONGO_URI` — MongoDB connection string
- `API_KEY` — API key required by the middleware
- `PORT` — (optional) port the server will listen on

## API Endpoints

Base path: `/products`

- GET /products

  - Query params (optional): `category` (string), `page` (number, default 1), `limit` (number, default 10)
  - Response: `{ total, page, totalPages, results }` where `results` is an array of product objects

- GET /products/stats

  - Response: `{ totalProducts, countByCategory }` where `countByCategory` is an array of `{ category, count }`

- GET /products/search?name=term

  - Search products by partial/case-insensitive name match
  - Returns array of matching products or 404 if none

- GET /products/:id

  - Returns a single product by MongoDB `_id`

- POST /products

  - Creates a new product. Request body (JSON): `{ name, description, price, category, inStock }`
  - Required fields: `name`, `description`, `price`, `category` (`inStock` is optional and should be boolean if provided)
  - Responds with `201 Created` and the created product

- PUT /products/:id

  - Updates a product. Body follows same validation as POST. Returns updated product.

- DELETE /products/:id
  - Deletes a product. Returns `{ message: "Product deleted" }`

### Product object shape

Example product document:

```json
{
  "_id": "64a3f9e...",
  "name": "Sample Product",
  "description": "A short description",
  "price": 19.99,
  "category": "Books",
  "inStock": true
}
```

## Examples (PowerShell)

Replace `your_api_key_here` with the value from your `.env`.

1. Get paginated products

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/products?page=1&limit=5" -Headers @{"x-api-key"="your_api_key_here"}
```

Response (example):

```json
{
  "total": 24,
  "page": 1,
  "totalPages": 5,
  "results": [
    /* array of product objects */
  ]
}
```

2. Search products by name

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/products/search?name=apple" -Headers @{"x-api-key"="your_api_key_here"}
```

3. Create a product

```powershell
$body = @{
  name = "New Product"
  description = "Created via API"
  price = 12.5
  category = "Gadgets"
  inStock = $true
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/products" -Headers @{"x-api-key"="your_api_key_here"; "Content-Type"="application/json"} -Body $body
```

Response (201 Created): the created product JSON

4. Update a product

```powershell
$update = @{ price = 14.99 } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:5000/products/<PRODUCT_ID>" -Headers @{"x-api-key"="your_api_key_here"; "Content-Type"="application/json"} -Body $update
```

5. Delete a product

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/products/<PRODUCT_ID>" -Headers @{"x-api-key"="your_api_key_here"}
```

## Notes & Troubleshooting

- The project expects `MONGO_URI` to be set and reachable. If the DB connection fails the server will exit.
- The auth middleware expects the header `x-api-key` to exactly match `API_KEY` from your `.env`.
- The repository's `package.json` does not include a `start` script. Use `node server.js` or add a script like `"start": "node server.js"` if you prefer `npm start`.


