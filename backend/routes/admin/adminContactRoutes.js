const express = require('express');
const router = express.Router();
const { getContactMessages, updateMessageStatus, deleteContactMessage } = require('../../controllers/admin/adminContactController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.get('/', protectAdmin, getContactMessages);
router.patch('/:id', protectAdmin, updateMessageStatus);
router.delete('/:id', protectAdmin, deleteContactMessage);

module.exports = router;
