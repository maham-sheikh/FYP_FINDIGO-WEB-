const express = require('express');
const serviceController = require('../controllers/servicecontroller');

const router = express.Router();

router.get('/', serviceController.getAllServices);

router.get('/:id', serviceController.getServiceById);

router.post('/', serviceController.addService);

router.put('/:id', serviceController.updateService);

router.delete('/:id', serviceController.deleteService);

module.exports = router;