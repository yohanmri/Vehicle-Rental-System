const express = require('express');
const router = express.Router();
const { adminLogin, changePassword, changeUsername } = require('../../controllers/admin/adminAuthController');
const { protectAdmin } = require('../../middleware/adminMiddleware');

router.post('/login', adminLogin);
router.post('/change-password', protectAdmin, changePassword);
router.patch('/change-username', protectAdmin, changeUsername);

module.exports = router;
