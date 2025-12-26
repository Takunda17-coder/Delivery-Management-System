const express = require('express');
const router = express.Router();
const deviceController = require('../controller/devices.controller');

router.post('/', deviceController.createDevice);
router.get('/', deviceController.getAllDevices);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;
