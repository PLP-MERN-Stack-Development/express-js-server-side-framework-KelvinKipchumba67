const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const validateProduct = require("../middleware/validateProducts");

// Get all products (with optional category filter + pagination)
router.get("/", async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = category ? { category: new RegExp(category, "i") } : {};

    // Convert page & limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Query products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum);

    // Count total products (for pagination info)
    const total = await Product.countDocuments(filter);

    res.json({
      total,               // total number of matching products
      page: pageNum,       // current page
      totalPages: Math.ceil(total / limitNum),
      results: products,   // products for this page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product statistics
router.get("/stats", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Group by category and count
    const countByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    res.json({
      totalProducts,
      countByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Search products by name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Please provide a search term using ?name=" });
    }

    // Case-insensitive partial match using regex
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found matching your search" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
});



// Create a new product
router.post("/", validateProduct, async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  try {
    const newProduct = new Product({ name, description, price, category, inStock });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing product
router.put("/:id", validateProduct, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
