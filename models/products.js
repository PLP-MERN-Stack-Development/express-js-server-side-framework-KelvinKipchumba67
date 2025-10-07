const mongoose = require("mongoose");

// defining the schema - use MongoDB _id (ObjectId) as primary identifier
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// create the model
const Products = mongoose.model("Product", productSchema);

module.exports = Products;