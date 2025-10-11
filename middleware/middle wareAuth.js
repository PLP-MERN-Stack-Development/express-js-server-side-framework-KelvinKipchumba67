require("dotenv").config(); // Load environment variables

const authMiddleware = (req, res, next) => {
  const apiKey = req.header("x-api-key"); // get API key from request header

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next(); // key is valid → move to next middleware or route
};

module.exports = authMiddleware;