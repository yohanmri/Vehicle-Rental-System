const express = require('express');
const router = express.Router();
const { getPublicTours } = require('../../controllers/user/tourController');

router.get('/', getPublicTours);

module.exports = router;
