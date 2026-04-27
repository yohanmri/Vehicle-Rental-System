const express = require('express');
const router = express.Router();
const { getAllTours, createTour, updateTour, deleteTour } = require('../../controllers/admin/tourController');
const { protectAdmin } = require('../../middleware/adminMiddleware');
const { upload } = require('../../config/cloudinary');

router.get('/', protectAdmin, getAllTours);
router.post('/', protectAdmin, upload.single('image'), createTour);
router.patch('/:id', protectAdmin, upload.single('image'), updateTour);
router.delete('/:id', protectAdmin, deleteTour);

module.exports = router;
