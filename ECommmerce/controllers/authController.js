import User from "../models/User.js"
import jwt from "jsonwebtoken";

const generateToken=(id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    )
};

export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        // Create User
        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({

            message: "User Registered Successfully",

            token: generateToken(user._id),

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Login User
    POST /api/auth/login
*/
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid Credentials"
            });

        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Credentials"
            });

        }

        res.status(200).json({

            message: "Login Successful",

            token: generateToken(user._id),

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Get Logged In User
    GET /api/auth/profile
*/
export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Update Profile
    PUT /api/auth/profile
*/
export const updateProfile = async (req, res) => {

    try {

        const { name, email } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({

            message: "Profile Updated",

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Change Password
    PUT /api/auth/change-password
*/
export const changePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) {

            return res.status(400).json({
                message: "Old Password Incorrect"
            });

        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({

            message: "Password Changed Successfully"

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};