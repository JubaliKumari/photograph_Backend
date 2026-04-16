import Products from "../models/Products.js";

// ✅ Create Products
export const createProducts = async (req, res) => {
  try {
    const { heading, description } = req.body;

    if (!heading) {
      return res.status(400).json({ error: "Heading is required" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload images" });
    }

    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );

    const newProduct = new Products({
      heading,
      description,
      images: imageUrls,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully ✅",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All
export const getAllProducts = async (req, res) => {
  try {
    const data = await Products.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Products.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};