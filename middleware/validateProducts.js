const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  // Check required fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      message: "Missing required fields: name, description, price, or category",
    });
  }

  // Validate data types
  if (typeof name !== "string" || typeof description !== "string" || typeof category !== "string") {
    return res.status(400).json({ message: "Name, description, and category must be strings" });
  }

  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  if (typeof inStock !== "boolean" && inStock !== undefined) {
    return res.status(400).json({ message: "inStock must be a boolean" });
  }

  next(); //  Passed validation — continue to route handler
};

module.exports = validateProduct;
