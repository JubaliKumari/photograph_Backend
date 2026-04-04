import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🔐 REGISTER USER
export const createUser = async (req, res) => {
    try {
        const { email, password, phone, role } = req.body;

        if (!email || !password || !phone || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            phone,
            role,
        });

        const { password: _, ...userData } = newUser._doc;

        return res.status(201).json({
            message: "User created successfully",
            user: userData,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// 🔑 LOGIN USER + JWT
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email or password not sent" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        const { password: _, ...userData } = user._doc;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email  not sent", success: false, });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false, });
        }


        return res.status(200).json({
            message: "Forgot Password successful",
            success: true,
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPassword = async (res, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email or password not sent", success: false, })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false, })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });

        return res.status(200).json({
            message: "Password reset successful",
            success: true,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

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
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users,
        });

    } catch (error) {
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// ✏️ UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, phone, password } = req.body;

        let updateData = { email, phone };

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
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// 📋 ADMIN: Get Users with Pagination + Search
export const getUsersAdmin = async (req, res) => {
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
};