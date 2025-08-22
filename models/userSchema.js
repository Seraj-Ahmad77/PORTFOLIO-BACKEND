import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name required."],
  },
  email: {
    type: String,
    required: [true, "Email required."],
  },
  phone: {
    type: String,
    required: [true, "phone Number required."],
  },
  aboutMe: {
    type: String,
    required: [true, "About me field is required."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [8, "Password must contain at least 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  portfolioURL: {
    type: String,
    required: [true, "Portfolio URL is required"],
  },
  githubURL: String,
  instagramURL: String,
  facebookURL: String,
  twitterURL: String,
  linkedInURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ✅ FIXED
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 1000 * 60;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
