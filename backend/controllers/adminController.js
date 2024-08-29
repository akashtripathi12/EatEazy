import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import adminModel from "../models/adminModel.js";

//login admin
const loginAdmin = async (req, res) => {
  const { adminKey, email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin does not exist" });
    }

    const isMatch = await (bcrypt.compare(password, admin.password) &&
      bcrypt.compare(adminKey, admin.adminKey));
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);
    return res.json({
      success: true,
      message: "Login Successful",
      token: token,
    });
  } catch (error) {
    res.json({ success: false, message: "Login Failed" });
  }
};

//generating token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register admin
const registerAdmin = async (req, res) => {
  const { adminKey, name, email, password } = req.body;
  try {
    const exists = await adminModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Admin already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const saltAdmin = await bcrypt.genSalt(10);
    const hashedAdminKey = await bcrypt.hash(adminKey, saltAdmin);

    //creating user
    const newAdmin = await adminModel({
      name: name,
      adminKey: hashedAdminKey,
      email: email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    const token = generateToken(admin._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: "Some error occurred" });
  }
};

const adminToken = {
  token: "",
};

//token transfer
const tokenTransfer = async (req, res) => {
  const { token } = req.body;
  adminToken.token = token;
  res.json({ success: true, token: adminToken.token });
};

//token get
const getToken = async (req, res) => {
  // const token = tokenTransfer();
  // console.log(adminToken.token);
  res.json({ success: true, token: adminToken.token });
};

export { loginAdmin, registerAdmin, tokenTransfer, getToken };
