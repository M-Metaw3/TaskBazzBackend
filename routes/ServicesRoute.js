const express = require('express');
const router = express.Router();
const categoryvalidation = require('../validations/Categoryvalidation/Categoryvalidations');
const joifunctions = require('../validations/mainjoivalidations');
const ServicesController = require('../controllers/ServicesController/ServicesController');

router.post('/',ServicesController.createservices);
router.get('/', ServicesController.getAllservices);
router.get('/:id', ServicesController.getservices);
router.put('/:id', ServicesController.updateservices);
router.delete('/:id', ServicesController.deleteservices);




module.exports = router;
