import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🔐 GENERATE TOKEN
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

console.log("JWT_SECRET:", process.env.JWT_SECRET);

// 🔐 REGISTER USER
export const createUser = async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    // 1. Validation: Check if all fields are provided
    if (!email || !password || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check for existing user (Email OR Phone)
    const existingUser = await User.findOne({ 
        $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      const duplicateField = existingUser.email === email ? "Email" : "Phone number";
      return res.status(400).json({ 
        message: `${duplicateField} is already registered. Please use another.` 
      });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone,
      role,
    });

    // 5. Remove password from response
    const { password: _, ...userData } = newUser._doc;

    // 6. Generate Token (Optional for register, usually done for login)
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userData,
      token
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};


// 🔑 LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email or password required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id);

        const { password: _, ...userData } = user._doc;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// 📧 FORGOT PASSWORD (GENERATE RESET TOKEN)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({
            message: "Reset token generated",
            success: true,
            resetToken, // 👉 send via email in real app
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// 🔄 RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password required",
                success: false,
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                message: "Invalid or expired token",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(decoded.id, {
            password: hashedPassword,
        });

        return res.status(200).json({
            message: "Password reset successful",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// 📋 GET ALL USERS (Pagination + Search)
export const getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = {
            $or: [
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ],
        };

        const users = await User.find(query)
            .select("-password")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// 🔍 GET SINGLE USER
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// ✏️ UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phone, password } = req.body;

        let updateData = {};

        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// ❌ DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};