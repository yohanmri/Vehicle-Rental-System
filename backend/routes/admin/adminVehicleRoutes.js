const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../../controllers/admin/adminVehicleController');
const { protectAdmin } = require('../../middleware/adminMiddleware');
const { upload } = require('../../config/cloudinary');

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 3 }
]);

router.get('/', protectAdmin, getAllVehicles);
router.post('/', protectAdmin, uploadFields, createVehicle);
router.get('/:id', protectAdmin, getVehicleById);
router.patch('/:id', protectAdmin, uploadFields, updateVehicle);
router.delete('/:id', protectAdmin, deleteVehicle);

module.exports = router;
