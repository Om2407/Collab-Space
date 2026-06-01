import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
// req.headers.authorization — frontend har request mein header bhejega Authorization: Bearer eyJhbG... format mein. Yahan se token uthate hain.
// .split(" ")[1] — "Bearer tokenvalue" string ko split karo space se — index 0 mein "Bearer", index 1 mein actual token.
// jwt.verify() — token ko secret se decode karta hai. Agar token tamper hua ya expire hua toh error throw karega jo catch mein jayega.
// decoded.id — yaad hai generateToken mein { id } dala tha payload mein? Wahi id yahan milti hai decode hone ke baad.
// .select("-password") — user ka poora data lo but password field exclude karo. - minus ka matlab exclude.
// req.user = user — ab yeh user object poori request mein available hai. Isliye getMe controller mein directly req.user use kar sake.
