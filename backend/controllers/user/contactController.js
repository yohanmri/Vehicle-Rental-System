const ContactMessage = require('../../models/user/ContactMessage');

const submitContactMessage = async (req, res) => {
    try {
        const { phone, name, email, subject, message, wantsInfo } = req.body;

        if (!phone || !name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newMessage = new ContactMessage({
            phone,
            name,
            email,
            subject,
            message,
            wantsInfo: wantsInfo || false
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { submitContactMessage };
