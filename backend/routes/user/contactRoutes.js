const express = require('express');
const router = express.Router();
const { submitContactMessage } = require('../../controllers/user/contactController');

router.post('/', submitContactMessage);

module.exports = router;
