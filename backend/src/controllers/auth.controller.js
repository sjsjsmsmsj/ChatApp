import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // hash password 
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            return res.status(201).json({ message: "User created successfully" })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res)
        return res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email })

    } catch (error) {
        console.log("Error in login controller", error.message)
        return res.status(500).json({ message: "Server error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        return res.status(500).json({ message: "Server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profilePics"
        })

        const user = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Profile picture updated successfully" })


    } catch (error) {
        console.log("Error in updateProfile controller", error.message)
        return res.status(500).json({ message: "Server error" })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in check")
    }
}