import express from 'express'
import User from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../src/lib/utils.js';

export const signup = async (req, res) => {
    const { fullName, email, password, username } = req.body;
    try {
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be 6 characters." });
        }
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (user) return res.status(400).json({ message: "Email or username already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            fullName,
            username,
            password: hashedPassword

        })
        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res) //generate JWT
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        console.log('Error in signup controller:', error.message)
        res.status(500).json({ message: "Internal server error" });

    }
}
export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        if ((!email && !username) || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 🔍 Find user by either email or username
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic

        })
    } catch (error) {
        console.log("Error in login controller:", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout Successfully!" })
    } catch (error) {
        console.log("Error in logout controller:", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user._id; // We get this from your protectRoute middleware!

        // 1. Basic validation
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // 2. Check if the new username is already taken by someone ELSE
        const existingUser = await User.findOne({ 
            username, 
            _id: { $ne: userId } // $ne means "not equal" - checks all users EXCEPT the current one
        });

        if (existingUser) {
            return res.status(400).json({ message: "This username is already taken" });
        }

        // 3. Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true } // This tells Mongoose to return the UPDATED document, not the old one
        ).select("-password"); // Don't send the password back to the frontend!

        // 4. Send the updated user back to the frontend
        res.status(200).json(updatedUser);
        
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const CheckAuth = (req, res) =>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

