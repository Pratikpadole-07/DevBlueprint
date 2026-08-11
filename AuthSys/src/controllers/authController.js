import User from "../models/USer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register =async (req,res)=>{
    try{
        const {name,email,password}=req.body;


        if(!name || !email || !password){
            return res.status(400).json({
                message:"All files are required"
            });
        }

        const existingUser =await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            message:"User Registered Successfully",
            user
        });
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }

};


export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

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

        res.json({
            message: "Profile Updated",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const changePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({

                message: "Old Password Incorrect"

            });

        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.json({

            message: "Password Changed Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};