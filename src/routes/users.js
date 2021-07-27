const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/UserController');
const verifyRole = require("../middlewares/verifyRole")
const Role = require("../helpers/role");

router.post('/users', verifyRole([Role.Admin]), UserController.create);
router.get('/users', verifyRole([Role.Admin]), UserController.getAll);
router.get('/users/:id', verifyRole([Role.Admin]), UserController.getById);
router.delete('/users/:id', verifyRole([Role.Admin]), UserController.deleteUser);

module.exports = router;