
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
    let token;
    if (req.cookies.jwt)
        token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded)
            return res.status(401).json({ message: "Unauthorized" })
        const user = await User.findById(decoded.userId).select("-password")
        if (!user)
            return res.status(401).json({ message: "Unauthorized" })
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Unauthorized" })
    }
}