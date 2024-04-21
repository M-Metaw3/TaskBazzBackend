const express = require('express');
const router = express.Router();
const categoryvalidation = require('../validations/Categoryvalidation/Categoryvalidations');
const joifunctions = require('../validations/mainjoivalidations');
const CategoryController = require('../controllers/CategoryController/CategoryController');

router.post('/',joifunctions(categoryvalidation), CategoryController.createCategory);
router.get('/', CategoryController.getAllCategory);
router.get('/:id', CategoryController.getCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);




module.exports = router;
