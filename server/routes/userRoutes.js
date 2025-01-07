const express = require('express');
const userController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.post('/', userController.addUser);

router.put('/:id', userController.editUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;