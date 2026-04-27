const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../../controllers/admin/adminVehicleController');
const { protectAdmin } = require('../../middleware/adminMiddleware');
const { upload } = require('../../config/cloudinary');

router.get('/', protectAdmin, getAllVehicles);
router.post('/', protectAdmin, upload.single('image'), createVehicle);
router.patch('/:id', protectAdmin, upload.single('image'), updateVehicle);
router.delete('/:id', protectAdmin, deleteVehicle);

module.exports = router;
