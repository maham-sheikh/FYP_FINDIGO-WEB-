const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController'); 

router.post('/', businessController.submitBusiness);

router.get('/unverified', businessController.getUnverifiedBusinesses);

router.get('/verified', businessController.getVerifiedBusinesses);

router.put('/approve', businessController.approveBusiness);

router.put('/reject', businessController.rejectBusiness);

module.exports = router;