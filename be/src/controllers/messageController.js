const Message = require('../models/Message');

// @desc    Get all messages for user
// @route   GET /api/v1/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: req.user.id },
        { receiver_id: req.user.id }
      ]
    }).sort('-sent_at');
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inbox messages
// @route   GET /api/v1/messages/inbox
// @access  Private
exports.getInboxMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ receiver_id: req.user.id })
      .sort('-sent_at');
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sent messages
// @route   GET /api/v1/messages/sent
// @access  Private
exports.getSentMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ sender_id: req.user.id })
      .sort('-sent_at');
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single message
// @route   GET /api/v1/messages/:id
// @access  Private
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Make sure user is sender or receiver
    if (message.sender_id.toString() !== req.user.id && message.receiver_id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this message'
      });
    }
    
    // Mark as read if user is receiver
    if (message.receiver_id.toString() === req.user.id && !message.is_read) {
      await Message.findByIdAndUpdate(req.params.id, {
        is_read: true,
        read_at: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/v1/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    req.body.sender_id = req.user.id;
    
    const message = await Message.create(req.body);
    
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to message
// @route   POST /api/v1/messages/:id/reply
// @access  Private
exports.replyToMessage = async (req, res, next) => {
  try {
    const originalMessage = await Message.findById(req.params.id);
    
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found'
      });
    }
    
    // Create reply
    const replyData = {
      sender_id: req.user.id,
      receiver_id: originalMessage.sender_id,
      subject: `Re: ${originalMessage.subject}`,
      content: req.body.content,
      message_type: originalMessage.message_type,
      replied_to: originalMessage._id,
      related_application_id: originalMessage.related_application_id,
      related_job_id: originalMessage.related_job_id
    };
    
    const reply = await Message.create(replyData);
    
    res.status(201).json({
      success: true,
      data: reply
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/v1/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Make sure user is sender or receiver
    if (message.sender_id.toString() !== req.user.id && message.receiver_id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
