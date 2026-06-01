import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    totalStudyHours: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Password hash — save hone se pehle automatically chalega
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  
});

// Password compare — login time pe use hoga
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

// pre("save") — yeh Mongoose middleware hai. Jab bhi user save hoga database mein, yeh function pehle chalega aur password ko hash kar dega. Isliye controller mein manually hash nahi karna padega.
// isModified("password") — agar user sirf naam update kar raha hai toh password dobara hash mat karo. Yeh check zaroori hai.
// bcrypt.hash(password, 10) — 10 salt rounds hain. Jitna zyada, utna secure but slow. 10 industry standard hai.
// matchPassword — yeh custom method hai jo login time pe use hoga. Plain password aur hashed password compare karta hai bcrypt se.
// { timestamps: true } — Mongoose automatically createdAt aur updatedAt fields add kar deta hai.



// userSchema.pre("save", async function(next){
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })--next()-remove krdiya reason-Kyun: Mongoose ke newer versions mein async pre hooks mein next automatically handle hota hai — manually call karne ki zaroorat nahi. next parameter pass karne se conflict ho raha tha.
