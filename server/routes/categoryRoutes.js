const express = require('express');
const categoryController = require('../controllers/categorycontroller');

const router = express.Router();

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/', categoryController.addCategory);

router.put('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;