import express from "express";
import {
  loginAdmin,
  registerAdmin,
  tokenTransfer,
  getToken,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/dashboard", tokenTransfer);
adminRouter.get("/getid", getToken);

export default adminRouter;
