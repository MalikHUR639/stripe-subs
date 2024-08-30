import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgetPassword,
  resetPassword,
  loginUrl,
  Token
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", protect, logoutUser);
router.post("/loginUrl", loginUrl);
router.get("/Token",Token);
router
  .route("/profile")
  .post(protect, getUserProfile)
  .patch(protect, updateUserProfile);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
