import express from "express";
import {
    createUser,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// 🔐 Auth
router.post("/register", createUser);
router.post("/login", login);

// 📋 Users
router.get("/", getAllUsers);          // pagination + search
router.get("/:id", getUserById);       // single user
router.put("/:id", updateUser);        // update
router.delete("/:id", deleteUser);     // delete

export default router;