const express = require('express');
const router = express.Router();
const { getContactMessages, updateMessageStatus, deleteContactMessage } = require('../../controllers/admin/adminContactController');
const { protect, admin } = require('../../middleware/authMiddleware');

router.get('/', protect, admin, getContactMessages);
router.patch('/:id', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteContactMessage);

module.exports = router;
