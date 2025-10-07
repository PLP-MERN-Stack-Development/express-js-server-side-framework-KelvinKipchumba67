// server.js - Complete Express server for Week 2 assignment

// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());



// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// // Simple authentication middleware
// app.use((req, res, next) => {
//   const auth = req.headers.authorization;
//   if (!auth || auth !== "Bearer secret123") {
//     return res.status(401).json({ message: "Unauthorized. Provide valid token." });
//   }
//   next();
// });


// Use the Products mongoose model (persistent storage)
const Products = require("./models/products");

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/products_db";
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Seed sample products if collection is empty
    const count = await Products.countDocuments();
    if (count === 0) {
      await Products.insertMany([
        {
          name: "Laptop",
          description: "High-performance laptop with 16GB RAM",
          price: 1200,
          category: "electronics",
          inStock: true,
        },
        {
          name: "Smartphone",
          description: "Latest model with 128GB storage",
          price: 800,
          category: "electronics",
          inStock: true,
        },
        {
          name: "Coffee Maker",
          description: "Programmable coffee maker with timer",
          price: 50,
          category: "kitchen",
          inStock: false,
        },
      ]);
      console.log("Seeded sample products");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });


// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Product API! Go to /api/products to see all products.");
});

// GET /api/products - Get all products
app.get("/api/products", async (req, res, next) => {
  try {
    const all = await Products.find();
    res.json(all);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product
app.post("/api/products", async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const created = await Products.create({
      name,
      description,
      price,
      category,
      inStock: inStock ?? true,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update a product
app.put("/api/products/:id", async (req, res, next) => {
  try {
    const updated = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const deleted = await Products.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", deleted });
  } catch (err) {
    next(err);
  }
});


app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
