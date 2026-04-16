import Travelling from "../models/Travelling.js";

// ✅ Create Travelling
// export const createTravelling = async (req, res) => {
//   try {
//     const { heading,description } = req.body;

//     if (!heading) {
//       return res.status(400).json({ error: "Heading is required" });
//     }

//     if (!description) {
//       return res.status(400).json({ error: "Description is required" });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "Please upload images" });
//     }

//     const imageUrls = req.files.map(
//       (file) => `http://localhost:5000/uploads/${file.filename}`
//     );

//     const newTravelling = new Travelling({
//       heading,
//       description,
//       images: imageUrls,
//     });

//     await newTravelling.save();

//     res.status(201).json({
//       message: "Travelling created successfully ✅",
//       data: newTravelling ,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const createTravelling = async (req, res) => {
//   try {
//     const { heading, description } = req.body;

//     if (!heading) {
//       return res.status(400).json({ error: "Heading is required" });
//     }

//     if (!description) {
//       return res.status(400).json({ error: "Description is required" });
//     }

//     // ✅ single image check
//     if (!req.file) {
//       return res.status(400).json({ error: "Please upload an image" });
//     }

//     const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

//     const newTravelling = new Travelling({
//       heading,
//       description,
//       image: imageUrl, // ✅ single field
//     });

//     await newTravelling.save();

//     res.status(201).json({
//       message: "Travelling created successfully ✅",
//       data: newTravelling,
//     });
//   } catch (error) {
//     console.error(error); // 👈 VERY IMPORTANT
//     res.status(500).json({ error: error.message });
//   }
// };

// export const createTravelling = async (req, res) => {
//   try {
//     console.log("=== UPLOAD DEBUG ===");
//     console.log("req.body →", req.body);
//     console.log("req.file →", req.file);        // ← This is the key
//     console.log("Files received:", req.files); // in case it's using array

//     const { heading, description } = req.body;

//     if (!heading || heading.trim() === "") {
//       return res.status(400).json({ error: "Heading is required" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ 
//         error: "No image received. Check field name and FormData.",
//         receivedField: Object.keys(req.body) // for debugging
//       });
//     }

//     const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

//     // const newTravelling = new Travelling({
//     //   heading: heading.trim(),
//     //   description: description ? description.trim() : "",
//     //   image: imageUrl,
//     // });
//     const newTravelling = new Travelling({
//   heading: heading.trim(),
//   description: description ? description.trim() : "",
//   images: [imageUrl], // ✅ CORRECT (array)
// });

//     await newTravelling.save();

//     res.status(201).json({
//       message: "Travelling created successfully ✅",
//       data: newTravelling,
//     });
//   } catch (error) {
//     console.error("Full Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

export const createTravelling = async (req, res) => {
  try {
    console.log("=== UPLOAD DEBUG ===");
    console.log("req.body →", req.body);
    console.log("req.file →", req.file);

    const { heading, description } = req.body;

    if (!heading || heading.trim() === "") {
      return res.status(400).json({ error: "Heading is required" });
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: "No image received by server. Check FormData key name." 
      });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

   const newTravelling = new Travelling({
      heading: heading.trim(),
      description: description ? description.trim() : "",
      images: [imageUrl], // ✅ FIXED HERE
    });

    await newTravelling.save();

    console.log("✅ Saved successfully:", newTravelling);

    res.status(201).json({
      message: "Travelling created successfully ✅",
      data: newTravelling,
    });
  } catch (error) {
    console.error("Full Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// ✅ Get All
export const getAllTravelling = async (req, res) => {
  try {
    const data = await Travelling.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete
export const deleteTravelling = async (req, res) => {
  try {
    const { id } = req.params;

    await Travelling.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};