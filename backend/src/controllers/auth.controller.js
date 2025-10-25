require("dotenv").config();
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    fullName: { firstName, lastName },
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  return res
    .status(201)
    .json({ message: "User registered successfully", user });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  return res.status(200).json({ message: "User logged in successfully", user });
}

module.exports = {
  registerUser,
  loginUser,
};
