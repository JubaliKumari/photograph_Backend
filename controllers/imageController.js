// // // import Image from "../models/Image.js";
// // import Image from "../models/ImageSlider.js";
// // import fs from "fs";


// // // 📤 UPLOAD IMAGE
// // export const uploadImage = async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Image is required",
// //       });
// //     }

// //     const newImage = await Image.create({
// //       image: `/uploads/${req.file.filename}`, // ✅ fixed path
// //     });

// //     return res.status(201).json({
// //       success: true,
// //       message: "Image uploaded successfully",
// //       data: newImage,
// //     });

// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };



// // // 📋 GET IMAGES (with optional pagination)
// // export const getImages = async (req, res) => {
// //   try {
// //     let { page, limit } = req.query;

// //     if (page && limit) {
// //       page = parseInt(page);
// //       limit = parseInt(limit);

// //       const images = await Image.find()
// //         .sort({ createdAt: -1 })
// //         .skip((page - 1) * limit)
// //         .limit(limit);

// //       const total = await Image.countDocuments();

// //       return res.status(200).json({
// //         success: true,
// //         total,
// //         page,
// //         totalPages: Math.ceil(total / limit),
// //         data: images,
// //       });
// //     }

// //     // fallback → return all
// //     const images = await Image.find().sort({ createdAt: -1 });

// //     return res.status(200).json({
// //       success: true,
// //       data: images,
// //     });

// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };



// // // ❌ DELETE IMAGE (with file cleanup)
// // export const deleteImage = async (req, res) => {
// //   try {
// //     const image = await Image.findById(req.params.id);

// //     if (!image) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Image not found",
// //       });
// //     }

// //     // 🧹 delete file from server
// //     if (image.image) {
// //       try {
// //         fs.unlinkSync(`.${image.image}`);
// //       } catch (err) {
// //         console.log("File delete error:", err.message);
// //       }
// //     }

// //     await image.deleteOne();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Image deleted successfully",
// //     });

// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// import Image from "../models/ImageSlider.js";
// import fs from "fs";

// // 🔥 helper function to format heading
// const formatHeading = (heading) => {
//   return heading
//     .trim()
//     .split(/\s+/) // split by spaces
//     .filter((word) => word)
//     .map((word) => word.toUpperCase() + ".")
//     .join("\n");
// };

// // 📤 UPLOAD IMAGE
// export const uploadImage = async (req, res) => {
//   try {
//     const { heading, description } = req.body;

//     if (!heading?.trim() || !description?.trim() || !req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Heading, description and image are required",
//       });
//     }

//     const newImage = await Image.create({
//       heading: formatHeading(heading),
//       description: description.trim(),
//       image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Image uploaded successfully",
//       data: newImage,
//     });
//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // 📋 GET IMAGES (with optional pagination)
// export const getImages = async (req, res) => {
//   try {
//     let { page, limit } = req.query;

//     if (page && limit) {
//       page = parseInt(page);
//       limit = parseInt(limit);

//       const images = await Image.find()
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit);

//       const total = await Image.countDocuments();

//       return res.status(200).json({
//         success: true,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//         data: images,
//       });
//     }

//     const images = await Image.find().sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       data: images,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ✏️ UPDATE IMAGE
// export const updateImage = async (req, res) => {
//   try {
//     const imageDoc = await Image.findById(req.params.id);

//     if (!imageDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found",
//       });
//     }

//     const { heading, description } = req.body;

//     if (heading?.trim()) {
//       imageDoc.heading = formatHeading(heading);
//     }

//     if (description?.trim()) {
//       imageDoc.description = description.trim();
//     }

//     if (req.file) {
//       if (imageDoc.image) {
//         try {
//           const oldFile = imageDoc.image.split("/uploads/")[1];
//           fs.unlinkSync(`uploads/${oldFile}`);
//         } catch (err) {
//           console.log("Old image delete failed:", err.message);
//         }
//       }

//       imageDoc.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     await imageDoc.save();

//     return res.status(200).json({
//       success: true,
//       message: "Image updated successfully",
//       data: imageDoc,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // ❌ DELETE IMAGE
// export const deleteImage = async (req, res) => {
//   try {
//     const image = await Image.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found",
//       });
//     }

//     if (image.image) {
//       try {
//         const oldFile = image.image.split("/uploads/")[1];
//         fs.unlinkSync(`uploads/${oldFile}`);
//       } catch (err) {
//         console.log("File delete error:", err.message);
//       }
//     }

//     await image.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Image deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import Image from "../models/ImageSlider.js";
import fs from "fs";

// 🔥 helper function to format heading
const formatHeading = (heading) => {
  return heading
    .trim()
    .split(/\s+/) // split by spaces
    .filter((word) => word)
    .map((word) => word.toUpperCase() + ".")
    .join("\n");
};

// 📤 UPLOAD IMAGE
export const uploadImage = async (req, res) => {
  try {
    const { heading, description } = req.body;

    if (!heading?.trim() || !description?.trim() || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Heading, description and image are required",
      });
    }

    const newImage = await Image.create({
      heading: formatHeading(heading),
      description: description.trim(),
      image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📋 GET IMAGES (with optional pagination)
export const getImages = async (req, res) => {
  try {
    let { page, limit } = req.query;

    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);

      const images = await Image.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Image.countDocuments();

      return res.status(200).json({
        success: true,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: images,
      });
    }

    const images = await Image.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✏️ UPDATE IMAGE
export const updateImage = async (req, res) => {
  try {
    const imageDoc = await Image.findById(req.params.id);

    if (!imageDoc) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const { heading, description } = req.body;

    if (heading?.trim()) {
      imageDoc.heading = formatHeading(heading);
    }

    if (description?.trim()) {
      imageDoc.description = description.trim();
    }

    if (req.file) {
      if (imageDoc.image) {
        try {
          const oldFile = imageDoc.image.split("/uploads/")[1];
          fs.unlinkSync(`uploads/${oldFile}`);
        } catch (err) {
          console.log("Old image delete failed:", err.message);
        }
      }

      imageDoc.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await imageDoc.save();

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: imageDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ DELETE IMAGE
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.image) {
      try {
        const oldFile = image.image.split("/uploads/")[1];
        fs.unlinkSync(`uploads/${oldFile}`);
      } catch (err) {
        console.log("File delete error:", err.message);
      }
    }

    await image.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};