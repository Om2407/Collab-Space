import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: "30d"});
}
//Register User
//route -- POST /api/auth/register

export const registerUser = async (req, res) =>{
    try{
        const {name,email,password} = req.body;

        //check if user exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User Already exists-bhai"});
        }

        //Create User
        const user = await User.create({name,email,password});

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch(error){
          console.error("Register error:", error); 
        res.status(500).json({message: error.message});
    }
}
// @desc    Login user
// @route   POST /api/auth/login

export const loginUser = async (req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message: "Invalid email or password"});
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id),
        });

    }catch(error){
        res.status(500).json({message: error.message});
    }
};
// @desc    Get current user
// @route   GET /api/auth/me

export const getMe = async(req,res) =>{
res.json(req.user)
};
// generateToken — JWT token banata hai. Andar { id } payload hai — matlab token mein user ki id encoded hai. JWT_SECRET se sign hota hai — verify karte waqt yahi secret use hoga.
// User.create() — directly model pe call kiya, aur password automatically hash ho gaya kyunki pre("save") hook lagaya tha model mein.
// user.matchPassword() — wahi method jo model mein banaya tha. Login time pe plain password aur hashed password compare karta hai.
// getMe mein req.user — yeh abhi empty hai, kyunki middleware nahi banaya. Middleware JWT verify karega aur user object req.user mein daalega. Woh next step hai.