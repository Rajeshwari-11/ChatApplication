import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [] // Initialize messages as an empty array
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    await newMessage.save(); // Save the new message to the database

    // Add the new message to the conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id); // Ensure correct field name `messages`
    }

    //SOCKET IO FUNCTIONALITY WILL GO HERE

    // Save the updated conversation
    await conversation.save();

    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async(req,res) => {
  try {

    const { id:userToChatId} = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId,userToChatId]},
    }).populate("messages");

    if(!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
    
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}