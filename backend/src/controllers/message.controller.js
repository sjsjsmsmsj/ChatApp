import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const fileredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        return res.status(200).json(fileredUsers)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: id },
                { senderId: id, receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 })
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: "Server error" })

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save()
        return res.status(200).json({ message: "Message sent successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}